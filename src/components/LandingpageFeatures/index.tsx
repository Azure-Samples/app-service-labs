import { ReactNode } from 'react';
import  TypewriterComponent  from '../TypewriterComponent';
import ImageRotator from '../ImageRotator';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';


const keywords = [
    'web apps',
    'APIs',
    'containers',
    'cloud-native apps',
    'Azure App Service',
  ];

  interface LandingpageFeaturesProps {
    images: string[];
  }  


export default function LandingpageFeatures({ images }: LandingpageFeaturesProps): ReactNode {
    return (
        //<section className={styles.largetext}>    
            <div className='container no-sidebar'>
                <div className="row">
                   <img className={styles.logo} src={useBaseUrl('/img/app-service-labs-logo.svg')}  alt="App Service Labs logo"  />
                </div>
                <div className='row'>
                    <div className='col col--6'>
                        <div className="row">
                            <div className={styles.largetext}>
                                Hands-on tutorials to <span className={styles.accenttext}>learn</span> <br />
                                and <span className={styles.accenttext}>teach</span> <TypewriterComponent words={keywords} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`${styles.subtitle}`}> 
                                Grab-and-go resources to help you learn new skills but also <a href="./contributing">contribute</a> your own workshop to help others on their App Service learning journey.
                            </div>
                        </div>
                        <div className='row'>
                            <div className='{styles.buttons}'>
                                <Link 
                                    className="button button--lg button--primary"
                                    to="/docs/intro">
                                    Browse Workshops
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='col col--6'>
                        <div className={styles.img450x450}>
                            <ImageRotator images={images} />
                        </div>
                    </div>
                </div>
            </div>
        //</section>
    )
}
