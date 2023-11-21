'use client'

export default function Header() {
  return (
    <>
      <header>
        <span className="inner-text">Header</span>
      </header>

      <style jsx>{`
        header {
          height: 100px;
          background-color: #eeb9be;
          display: flex;
        }
      `}</style>
    </>
  )
}
