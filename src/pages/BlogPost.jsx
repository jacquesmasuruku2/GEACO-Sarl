import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useBlogPost } from '../hooks/useBlogPost'
import { formatNavLabel } from '../lib/formatNavLabel'
import { BlogShareBar } from '../components/BlogShareBar'
import { RichTextContent } from '../components/RichTextContent'
import { supabase } from '../lib/supabase'

export function BlogPost() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const { row, loading } = useBlogPost(slug || '', locale)
  const [session, setSession] = useState(null)
  const [likesCount, setLikesCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [likesUsers, setLikesUsers] = useState([])
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(true)
  const [rating, setRating] = useState(5)
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const user = session?.user ?? null
  const userDisplayName = useMemo(() => {
    const meta = user?.user_metadata ?? {}
    return (
      String(meta.full_name || meta.name || '').trim() ||
      String(user?.email || '').split('@')[0] ||
      'Membre'
    )
  }, [user])

  useEffect(() => {
    if (!user) return
    setAuthorName(userDisplayName)
    setAuthorEmail(String(user.email || '').trim())
  }, [user, userDisplayName])

  useEffect(() => {
    if (!supabase) return
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data?.session ?? null)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })
    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function loadEngagement(postId) {
    if (!supabase || !postId) return
    const [reactionRes, commentRes] = await Promise.all([
      supabase
        .from('site_blog_post_reactions')
        .select('user_id,user_display_name,user_email,liked,rating,created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: false }),
      supabase
        .from('site_blog_post_comments')
        .select('id,user_id,user_display_name,user_email,comment,created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: false }),
    ])

    if (reactionRes.error) {
      setErrorMsg(reactionRes.error.message)
    } else {
      const reactionRows = reactionRes.data ?? []
      const likeRows = reactionRows.filter((item) => item.liked)
      setLikesCount(likeRows.length)
      setAvgRating(
        reactionRows.length
          ? reactionRows.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / reactionRows.length
          : 0,
      )
      setLikesUsers(
        likeRows.map((item) => ({
          key: `${item.user_id}-${item.created_at}`,
          name: item.user_display_name || (item.user_email ? String(item.user_email).split('@')[0] : 'Membre'),
        })),
      )
      if (user) {
        const own = reactionRows.find((item) => item.user_id === user.id)
        if (own) {
          setLiked(Boolean(own.liked))
          setRating(Number(own.rating) || 5)
        }
      }
    }

    if (commentRes.error) {
      setErrorMsg(commentRes.error.message)
    } else {
      setComments(commentRes.data ?? [])
    }
  }

  useEffect(() => {
    if (!row?.id) return
    loadEngagement(row.id)
  }, [row?.id, user?.id])

  async function saveReaction() {
    if (!supabase || !row?.id) return
    const displayName = String(authorName || userDisplayName || '').trim()
    const email = String(authorEmail || user?.email || '').trim().toLowerCase()
    if (displayName.length < 2 || email.length < 3) {
      setErrorMsg(t('blog.identityRequired'))
      return
    }
    setBusy(true)
    setErrorMsg('')
    setStatusMsg('')
    const { error } = await supabase.from('site_blog_post_reactions').upsert(
      {
        post_id: row.id,
        user_id: user?.id ?? null,
        user_display_name: displayName,
        user_email: email,
        liked: Boolean(liked),
        rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      },
      { onConflict: 'post_id,user_email' },
    )
    setBusy(false)
    if (error) {
      setErrorMsg(error.message)
      return
    }
    setStatusMsg(t('blog.memberSaved'))
    loadEngagement(row.id)
  }

  async function submitComment(event) {
    event.preventDefault()
    if (!supabase || !row?.id) return
    const displayName = String(authorName || userDisplayName || '').trim()
    const email = String(authorEmail || user?.email || '').trim().toLowerCase()
    if (displayName.length < 2 || email.length < 3) {
      setErrorMsg(t('blog.identityRequired'))
      return
    }
    const text = String(commentText ?? '').trim()
    if (text.length < 2) {
      setErrorMsg(t('blog.commentTooShort'))
      return
    }
    setBusy(true)
    setErrorMsg('')
    setStatusMsg('')
    const { error } = await supabase.from('site_blog_post_comments').insert({
      post_id: row.id,
      user_id: user?.id ?? null,
      user_display_name: displayName,
      user_email: email,
      comment: text,
    })
    setBusy(false)
    if (error) {
      setErrorMsg(error.message)
      return
    }
    setCommentText('')
    setStatusMsg(t('blog.commentSaved'))
    loadEngagement(row.id)
  }

  if (!slug) {
    return <Navigate to="/blog" replace />
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.loading')}</p>
        </div>
      </div>
    )
  }

  if (!row) {
    return <Navigate to="/blog" replace />
  }

  return (
    <>
      <Seo title={row.title} description={row.excerpt || row.title} path={`/blog/${slug}`} />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { href: '/blog', label: t('blog.title') },
          { label: row.title },
        ]}
        title={row.title}
        lead={row.excerpt || ''}
        heroImage={
          row.hero_image_url && String(row.hero_image_url).startsWith('http')
            ? row.hero_image_url
            : undefined
        }
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 'var(--max-text)' }}>
          {row.published_at ? (
            <p className="tag" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              {new Date(row.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')}
            </p>
          ) : null}
          <RichTextContent value={row.body || ''} />
          <section className="blog-engagement card" style={{ marginTop: '1.5rem' }}>
            <h2 style={{ marginTop: 0 }}>{t('blog.communityTitle')}</h2>
            <p className="admin-muted">
              {t('blog.likesCountLabel')}: <strong>{likesCount}</strong> · {t('blog.avgRatingLabel')}:{' '}
              <strong>{avgRating ? avgRating.toFixed(1) : '0.0'}/5</strong>
            </p>

            <div className="blog-member-panel">
              <p className="admin-muted">{t('blog.guestPrompt')}</p>
              <div className="blog-member-controls">
                <label>
                  {t('blog.commenterNameLabel')}
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={t('blog.commenterNamePlaceholder')}
                  />
                </label>
                <label>
                  {t('blog.commenterEmailLabel')}
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder={t('blog.commenterEmailPlaceholder')}
                  />
                </label>
                <label className="admin-check">
                  <input type="checkbox" checked={liked} onChange={(e) => setLiked(e.target.checked)} />
                  {t('blog.likeToggle')}
                </label>
                <div className="blog-stars-field">
                  {t('blog.ratingLabel')}
                  <div className="blog-stars" role="radiogroup" aria-label={t('blog.ratingLabel')}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`blog-star ${value <= rating ? 'is-active' : ''}`}
                        onClick={() => setRating(value)}
                        role="radio"
                        aria-checked={rating === value}
                        aria-label={`${value} sur 5`}
                        title={`${value}/5`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="blog-stars__value">{rating}/5</span>
                  </div>
                </div>
                <button type="button" className="btn btn--dark" onClick={saveReaction} disabled={busy}>
                  {busy ? t('forms.formSending') : t('blog.saveLikeRating')}
                </button>
              </div>
            </div>

            {errorMsg ? (
              <p className="admin-error admin-feedback" role="alert">
                {errorMsg}
              </p>
            ) : null}
            {statusMsg ? (
              <p className="admin-success admin-feedback" role="status">
                {statusMsg}
              </p>
            ) : null}

            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{t('blog.likersTitle')}</h3>
              {likesUsers.length ? (
                <div className="blog-likers-list">
                  {likesUsers.map((item) => (
                    <span key={item.key} className="tag">
                      {item.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="admin-muted">{t('blog.noLikersYet')}</p>
              )}
            </div>

            <div style={{ marginTop: '1.1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{t('blog.commentsTitle')}</h3>
              <form onSubmit={submitComment} className="admin-form">
                <label htmlFor="blog-comment-text">{t('blog.commentLabel')}</label>
                <textarea
                  id="blog-comment-text"
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('blog.commentPlaceholder')}
                />
                <button type="submit" className="btn btn--primary" disabled={busy}>
                  {busy ? t('forms.formSending') : t('blog.publishComment')}
                </button>
              </form>
              <div className="blog-comments-list">
                {comments.map((comment) => (
                  <article key={comment.id} className="blog-comment-item">
                    <p className="blog-comment-item__meta">
                      <strong>{comment.user_display_name || 'Membre'}</strong> ·{' '}
                      {new Date(comment.created_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')}
                    </p>
                    <p>{comment.comment}</p>
                  </article>
                ))}
                {!comments.length ? <p className="admin-muted">{t('blog.noCommentsYet')}</p> : null}
              </div>
            </div>
          </section>
          <BlogShareBar articleTitle={row.title} />
          <p style={{ marginTop: '2rem' }}>
            <Link className="btn btn--outline" to="/blog">
              {t('blog.backToList')}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
