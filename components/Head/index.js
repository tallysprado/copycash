import Head  from 'next/head';

const HeadComponent = () => {
  return (
    <Head>
      <title>Copycash</title>
      {//<link rel="shortcut icon" href="/favicon.ico" />
}
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta content="My personal site." name="description" />

      <meta property="og:title" content="Copycash" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Deixe eu operar na sua conta bote ai sua senha" />
      <meta
        property="og:image"
        content="https://i.ibb.co/b5rk9WL/logo.png"
      />
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>


    </Head>
  );
};

export default HeadComponent;