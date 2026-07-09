import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import LandingpageFeatures from '../components/LandingpageFeatures';
import UnderConstruction from '../components/UnderConstruction';

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
        <div className="container margin-bottom--xl">
          <UnderConstruction title="App Service Labs is under construction">
            This site is being built out for Azure App Service. Content and
            workshops are on the way &mdash; check back soon!
          </UnderConstruction>
        </div>
      </main>
    </Layout>
  );
}
