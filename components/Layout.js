import Head from "next/head";
import Link from "next/link";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} - Copilot PC` : `Copilot PC`}</title>
        <meta name="description" content="Copilot PC Web Site uwu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md bg-black text-slate-50 py-8">
            <Link href={"/"}>
              <a className="text-4xl font-bold">Copilot PC</a>
            </Link>
            <div>
              <Link href={"/cart"}>
                <a className="p-2">Carrito</a>
              </Link>
              <Link href={"/login"}>
                <a className="p-2">Ingresar</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-3 px-3">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          footer
        </footer>
      </section>
    </>
  );
}
