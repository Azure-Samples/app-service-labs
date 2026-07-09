import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import LandingpageFeatures from '../components/LandingpageFeatures';
import HomepageSections from '../components/HomepageSections';

const imageUrls = [
  './img/hero-deploy.png',
  './img/hero-build.png',
  './img/hero-learn.png'
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Hands-on tutorials and workshops for building, deploying, and operating apps on Azure App Service.">
      <main>
        <LandingpageFeatures images={imageUrls} />
        <HomepageSections />
      </main>
    </Layout>
  );
}
