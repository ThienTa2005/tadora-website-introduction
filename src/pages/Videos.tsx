import { useState } from 'react'
import { HubSection, PageHeading, SearchField, SelectField, normalizeSearch } from '../components/Hub'
import { VideoCards } from '../components/VideoHub'
import { TikTokCreatorLink } from '../components/TikTokCreatorLink'
import { catalog } from '../data/products'
import { videoCategories, videos } from '../data/videos'
import { creatorById, officialCreators, validCreators } from '../lib/affiliate'

export default function Videos() {
  const params = new URLSearchParams(window.location.search)
  const initialVideo = params.get('video') ?? undefined
  const [search, setSearch] = useState('')
  const [creator, setCreator] = useState('')
  const [product, setProduct] = useState(params.get('product') ?? '')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('featured')
  const term = normalizeSearch(search)
  const filtered = videos.filter((video) =>
    (!term || normalizeSearch([video.title, video.category, creatorById(video.creatorId)?.name,
      ...catalog.filter((item) => video.productCodes.includes(item.code)).map((item) => item.name)].join(' ')).includes(term)) &&
    (!creator || video.creatorId === creator || (creator === 'unattributed' && !video.creatorId)) &&
    (!product || video.productCodes.includes(product)) && (!category || video.category === category),
  )
  filtered.sort((a, b) => sort === 'newest'
    ? (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
    : Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  const creatorOptions = validCreators.map(({ id, name }) => ({ value: id, label: name }))
  if (videos.some((video) => !video.creatorId)) creatorOptions.push({ value: 'unattributed', label: 'Video sản phẩm chưa gắn creator' })

  return (
    <div className="hub-wrap">
      <PageHeading label="Video Review" title="Trải nghiệm thực tế cùng TADORA"
        description="Xem sản phẩm trong video dọc. Lọc theo sản phẩm, creator hoặc chủ đề bạn quan tâm." />
      <aside className="hub-disclosure" id="tiktok">
        <strong>Kênh TikTok Affiliate của đội</strong>
        {officialCreators.length ? (
          <div className="hub-tiktok-profiles">
            {officialCreators.map((item) => <TikTokCreatorLink key={item.id} className="hub-text-link" creator={item} position="video_hub" />)}
          </div>
        ) : <p>Tài khoản TikTok chính thức đang được cập nhật. Bạn có thể xem các video sản phẩm có sẵn bên dưới.</p>}
      </aside>
      <HubSection title="Thư viện video">
        <div className="hub-filter-grid hub-filter-grid--videos">
          <SearchField label="Tìm video" value={search} onChange={setSearch} placeholder="Tên video hoặc mã sản phẩm" />
          <SelectField label="Creator" value={creator} onChange={setCreator} options={creatorOptions} placeholder="Tất cả creator" />
          <SelectField label="Sản phẩm" value={product} onChange={setProduct} options={catalog.map((item) => ({ value: item.code, label: item.name }))} placeholder="Tất cả sản phẩm" />
          <SelectField label="Chủ đề" value={category} onChange={setCategory} options={videoCategories.map((item) => ({ value: item, label: item }))} placeholder="Tất cả chủ đề" />
          <SelectField label="Sắp xếp" value={sort} onChange={setSort} options={[{ value: 'featured', label: 'Nổi bật' }, { value: 'newest', label: 'Mới nhất' }]} />
        </div>
        <p className="hub-result-count" role="status">{filtered.length} video</p>
        {!filtered.length && <p className="hub-empty">Chưa có video phù hợp với bộ lọc này.</p>}
        <VideoCards items={filtered} initialId={initialVideo} />
      </HubSection>
    </div>
  )
}
