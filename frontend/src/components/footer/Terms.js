import React,{useEffect} from 'react';
import styles from './Terms.module.css';
import toc from './terms_and_conditions';
import Nav from '../services/Nav';

function Terms() {

  useEffect(() => {
    window.scrollTo(0,0);
  })

  const addBreakPoints = (body) =>{ 
    return {
      __html: body.replace(/\n/g, '<br>')
    }
  }

  return (
    <div className={styles.toc}>
      <Nav type="dark"/>
      <a href="/"> Back</a>
      <h1 className={styles.title}>{toc.title}</h1>
      {toc.sections.map((section, index)=>{
          return <div className={styles.section} key={index}>
              <div className={styles.section_title}>{section.title}</div>
              <div className={styles.description} dangerouslySetInnerHTML={addBreakPoints(section.description)} />
          </div>
      })}
    </div>
  )
}

export default Terms
