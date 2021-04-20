import Head from 'next/head'

interface HeadPorps { 
  title: string
}

export const HeadNext = ({ title }: HeadPorps) => {
  return (
    <Head>
      <title>
        {title}
      </title>
    </Head>
  )
}