import React from 'react'

import styles from '../styles/Layout.module.css';
import Header from './Header';
import Footer from './Footer';


function Layout({ children}) {
  return (
    <div className={styles.layout_wrapper}>
        <header>
            <Header />
        </header>
        <article>
            { children}
        </article>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default Layout