import * as React from 'react';
import {PageSection} from '~/client/shared/models';
import * as cx from 'classnames';
import * as styles from './SideMenu.scss';
import * as withStyles from 'isomorphic-style-loader/withStyles';

interface SideMenuProps {
  heading: PageSection;
  sections: PageSection[];
  menuVisible?: boolean;
  toggleVisibility(): void;
}

const SideMenu = ({heading, sections, menuVisible, toggleVisibility}: SideMenuProps) => {
  return <>
    <a
      href='#'
      className={cx(styles.menuLink, {[styles.active]: menuVisible})}
      key='1'
      onClick={toggleVisibility}>
      <span></span>
    </a>,
    <div key='2' className={cx(styles.menu, {[styles.active]: menuVisible})}>
      <div className='pure-menu'>
        <a
          className='pure-menu-heading'
          href={`#${heading.anchor}`}>
          {heading.name}
        </a>
        <ul className='pure-menu-list'>
          {sections.map((s, i) => (
            <li key={i} className='pure-menu-item'>
              <a
                href={`#${s.anchor}`}
                className={cx('pure-menu-link', {'menu-item-divided': s.divider})}>
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>;
};

export default withStyles(styles)(SideMenu);
