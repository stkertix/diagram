function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

function getSvgElement(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg')
  if (!svg) {
    throw new Error('Diagram SVG belum tersedia')
  }
  return svg
}

function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }
  return new XMLSerializer().serializeToString(clone)
}

export function downloadSvg(container: HTMLElement, filename = 'diagram.svg'): void {
  const svg = getSvgElement(container)
  const source = serializeSvg(svg)
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
  triggerDownload(blob, filename)
}

export async function downloadPng(
  container: HTMLElement,
  filename = 'diagram.png',
): Promise<void> {
  const svg = getSvgElement(container)
  const source = serializeSvg(svg)
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  try {
    const image = await loadImage(url)
    const width = svg.viewBox.baseVal.width || svg.clientWidth || image.width
    const height = svg.viewBox.baseVal.height || svg.clientHeight || image.height
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas tidak tersedia')
    }
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Gagal membuat PNG'))
      }, 'image/png')
    })
    triggerDownload(pngBlob, filename)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Gagal memuat SVG untuk PNG'))
    image.src = url
  })
}
