import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const productDirectory = path.join(root, 'public', 'assets', 'products')
const teamDirectory = path.join(root, 'public', 'assets', 'team')

const sourceFiles = async (directory, pattern) => (await readdir(directory))
  .filter((file) => pattern.test(file))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

const writeVariant = async (source, destination, size, quality) => {
  await sharp(source)
    .rotate()
    .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(destination)
}

const productFiles = await sourceFiles(productDirectory, /^\d{2}\.webp$/)
const teamFiles = await sourceFiles(teamDirectory, /^(?!.*-(?:600|1200)\.webp$).+\.webp$/)

let originalBytes = 0
let generatedBytes = 0
let generatedCount = 0

for (const file of productFiles) {
  const source = path.join(productDirectory, file)
  originalBytes += (await stat(source)).size
  const stem = path.parse(file).name
  for (const size of [480, 960]) {
    const destination = path.join(productDirectory, `${stem}-${size}.webp`)
    try {
      await writeVariant(source, destination, size, 78)
      generatedBytes += (await stat(destination)).size
      generatedCount += 1
    } catch (error) {
      console.warn(`Bỏ qua ${file}: ${error instanceof Error ? error.message : String(error)}`)
      break
    }
  }
}

for (const file of teamFiles) {
  const source = path.join(teamDirectory, file)
  originalBytes += (await stat(source)).size
  const stem = path.parse(file).name
  for (const [size, quality] of [[600, 78], [1200, 80]]) {
    const destination = path.join(teamDirectory, `${stem}-${size}.webp`)
    await writeVariant(source, destination, size, quality)
    generatedBytes += (await stat(destination)).size
    generatedCount += 1
  }
}

const format = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`
console.log(`Đã sinh ${generatedCount} ảnh: nguồn ${format(originalBytes)}, biến thể ${format(generatedBytes)}.`)
