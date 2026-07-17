# 3D Phone with TailwindCSS & Motion.dev

A quick experiment in pure-CSS 3D. The phone below is built entirely with Tailwind transforms and Motion's spring animations — no Three.js, no WebGL.

## The trick

Use 	ransform-style: preserve-3d on a parent, then rotate each face of the "phone" in 3D space. Motion's layout animation handles the initial reveal.

`	sx
<div className="preserve-3d rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
  <Face side="front" />
  <Face side="back" />
  <Face side="left" />
  <Face side="right" />
  <Face side="top" />
  <Face side="bottom" />
</div>
`

Could've used Three.js, but the file size would have been 10x. This version ships under 5KB gzipped for the entire scene.
