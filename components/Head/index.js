import Head  from 'next/head';

const HeadComponent = () => {
  return (
    <Head>
      <title>Copycash</title>
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta content="My personal site." name="description" />

      <meta property="og:title" content="Copycash" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Deixe os melhores operar em sua conta." />
      <meta
        property="og:image"
        content="https://ibb.co/q08hXKf"
      />
    </Head>
  );
};

export default HeadComponent;