'use client'

interface Props {
  children: React.ReactNode
}

export default function Wrapper({ children }: Props) {
  return (
    <>
      <div className="container">
        <aside className="sidebar">Sidebar</aside>

        <main className="content">{children}</main>
      </div>

      <style jsx global>{`
        body {
          min-height: 100vh;
        }

        .container {
          display: flex;
          height: calc(100vh - 100px);
        }

        .sidebar {
          width: 150px;
          background-color: #f7f7f7;
          display: flex;
        }

        .content {
          flex-grow: 1;
          display: flex;
          padding: 10px;
          overflow: scroll;
        }

        @media screen and (max-width: 525px) {
          .container {
            flex-direction: column-reverse;
          }
          .sidebar {
            width: 100%;
            height: 120px;
          }
        }
      `}</style>
    </>
  )
}
