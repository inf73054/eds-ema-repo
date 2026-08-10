/* eslint-disable */
/* global WebImporter */

/**
 * Import script for the global footer document (/footer) from the WKND footer.
 *
 * The EDS footer block (blocks/footer/footer.js) simply loads /footer as a
 * fragment and appends its content, so the structure here is authored directly:
 *   - brand link (WKND)
 *   - footer nav links (Magazine, Adventures, FAQs, About Us)
 *   - Follow Us heading + social links
 *   - copyright line
 */

const NAV = [
  { text: 'Magazine', href: '/magazine' },
  { text: 'Adventures', href: '/adventures' },
  { text: 'FAQs', href: '/faqs' },
  { text: 'About Us', href: '/about-us' },
];

const SOCIAL = [
  { text: 'Facebook', href: 'https://www.facebook.com/' },
  { text: 'Twitter', href: 'https://twitter.com/' },
  { text: 'Instagram', href: 'https://www.instagram.com/' },
];

export default {
  transform: (payload) => {
    const { document } = payload;

    const main = document.createElement('main');
    const wrap = document.createElement('div');

    // brand
    const brandP = document.createElement('p');
    const brandLink = document.createElement('a');
    brandLink.setAttribute('href', '/');
    brandLink.textContent = 'WKND';
    brandP.appendChild(brandLink);
    wrap.appendChild(brandP);

    // footer nav
    const navUl = document.createElement('ul');
    NAV.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', item.href);
      a.textContent = item.text;
      li.appendChild(a);
      navUl.appendChild(li);
    });
    wrap.appendChild(navUl);

    // Follow Us
    const follow = document.createElement('h4');
    follow.textContent = 'Follow Us';
    wrap.appendChild(follow);

    const socialUl = document.createElement('ul');
    SOCIAL.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', item.href);
      a.textContent = item.text;
      li.appendChild(a);
      socialUl.appendChild(li);
    });
    wrap.appendChild(socialUl);

    // copyright
    const copy = document.createElement('p');
    copy.textContent = '© 2019, WKND Site.';
    wrap.appendChild(copy);

    main.appendChild(wrap);

    return [{
      element: main,
      path: '/footer',
      report: { title: 'Footer', template: 'wknd-footer' },
    }];
  },
};
