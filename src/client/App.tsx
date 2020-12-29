import * as React from 'react';
import SideMenu from '~/client/shared/components/SideMenu';
import {PageSection} from '~/client/shared/models';
import {StateContext} from '~/ssr/StateContext';
import * as withStyles from 'isomorphic-style-loader/withStyles';
import * as styles from './App.scss';

const headingSection: PageSection = {
  anchor: 'heading',
  name: 'Home'
};

const sections: PageSection[] = [{
  anchor: 'sec1',
  name: 'Section 1',
}, {
  anchor: 'sec2',
  name: 'Section 2',
}, {
  anchor: 'sec3',
  name: 'Section 3',
  divider: true,
}];

const Text = () => (
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam
      nec lectus at semper. Maecenas vitae lectus non dui eleifend posuere. In
      hac habitasse platea dictumst. Morbi maximus, ligula sed maximus tempor,
      lorem felis tempor lacus, sit amet finibus enim eros eget metus. Quisque
      consectetur diam congue commodo pharetra. Cras vitae ligula lacus. Fusce
      laoreet sapien orci, ac auctor nulla interdum a. Sed euismod condimentum
      est. Nullam sed interdum nisl. Donec euismod aliquet libero vitae congue.
      Mauris et ex in tellus molestie semper accumsan vitae lectus.
    </p>
    <p>
      Quisque finibus placerat fermentum. Maecenas lobortis nunc a magna
      fermentum, imperdiet rutrum libero commodo. Aliquam congue, quam nec
      pulvinar mollis, dui sapien sodales turpis, at mattis odio dolor vel
      augue. Nulla facilisi. Mauris eget arcu eu velit commodo lobortis. Sed
      mattis ullamcorper lorem, non gravida enim efficitur vitae. In dignissim
      gravida nunc id gravida. Integer mauris lectus, iaculis non ex at,
      fermentum ultricies diam.
    </p>
  </div>
);

const MoreText = () => (
  <>
    <Text />
    <Text />
    <Text />
    <Text />
  </>
);

const App = () => {
  const state = React.useContext(StateContext);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleVisibility = () => setMenuVisible(s => !s);

  return (
    <div className={styles.root}>
      <SideMenu {...{sections, menuVisible, toggleVisibility}} heading={headingSection} />
      <div onClick={() => menuVisible && toggleVisibility()}>
          <div className={styles.header} id='heading'>
            <h1>Calendar Summary Report</h1>
            <h2>Dec 14th to Dec 20th</h2>
          </div>
          <div className={styles.content}>
            <button onClick={() => alert('works')}>Event Handler Test</button>
            <p> {state.data1} </p>
            <section id='sec1'>
              <h2 >Section 1</h2>
              <MoreText />
            </section>
            <section id='sec2'>
              <h2 >Section 2</h2>
              <MoreText />
            </section>
            <section id='sec3'>
              <h2 >Section 3</h2>
              <MoreText />
            </section>

          </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(App);
