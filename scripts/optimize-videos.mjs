import { copyFileSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const ffmpeg = process.argv[2] || 'ffmpeg'
const videoDirectory = resolve('public/videos/products')
const videos = readdirSync(videoDirectory)
  .filter((file) => file.endsWith('.mp4') && !file.endsWith('.optimizing.mp4'))
  .sort()

if (!videos.length) {
  console.log('No product videos found.')
  process.exit(0)
}

let totalBefore = 0
let totalAfter = 0

for (const file of videos) {
  const input = join(videoDirectory, file)
  const output = join(videoDirectory, `${basename(file, '.mp4')}.optimizing.mp4`)
  const before = statSync(input).size
  totalBefore += before

  const result = spawnSync(ffmpeg, [
    '-hide_banner',
    '-loglevel', 'error',
    '-y',
    '-i', input,
    '-map', '0:v:0',
    '-an',
    '-vf', "scale='min(720,iw)':-2:flags=lanczos,setsar=1",
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '30',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-movflags', '+faststart',
    output,
  ], { stdio: 'inherit' })

  if (result.status !== 0 || !existsSync(output)) {
    rmSync(output, { force: true })
    throw new Error(`FFmpeg failed for ${file}.`)
  }

  const optimized = statSync(output).size
  if (optimized < before) {
    copyFileSync(output, input)
    totalAfter += optimized
    console.log(`${file}: ${(before / 1048576).toFixed(2)} MB -> ${(optimized / 1048576).toFixed(2)} MB`)
  } else {
    totalAfter += before
    console.log(`${file}: kept original because the encoded file was not smaller`)
  }
  rmSync(output, { force: true })
}

console.log(`Total: ${(totalBefore / 1048576).toFixed(2)} MB -> ${(totalAfter / 1048576).toFixed(2)} MB`)
