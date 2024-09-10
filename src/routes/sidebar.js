/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    icon: 'FormsIcon',
    name: 'Products',
    routes: [
      {
        path: '/app/my_products',
        name: 'My Products',
      },
      {
        path: '/app/approved_products',
        name: 'Approved Products',
      },
      {
        path: '/app/pending_products',
        name: 'Products Pending Approval',
      }
    ]
  },
  // {
  //   path: '/app/videos',
  //   icon: 'PlayIcon',
  //   name: 'Videos',
  // },
  // {
  //   path: '/app/forms',
  //   icon: 'FormsIcon',
  //   name: 'Forms',
  // },
  // {
  //   path: '/app/cards',
  //   icon: 'CardsIcon',
  //   name: 'Cards',
  // },
  // {
  //   path: '/app/charts',
  //   icon: 'ChartsIcon',
  //   name: 'Charts',
  // },
  // {
  //   path: '/app/buttons',
  //   icon: 'ButtonsIcon',
  //   name: 'Buttons',
  // },
    {
    path: '/app/locations',
    icon: 'LocationIcon',
    name: 'Delivery Locations',
  },
  {
    icon: 'DeliveredIcon',
    name: 'Orders',
    routes: [
      // submenu
      {
        path: '/app/pending_orders',
        name: 'Pending Orders',
      },
      {
        path: '/app/delivered_orders',
        name: 'Delivered Orders',
      }
    ],
  },
  {
    path: '/app/modals',
    icon: 'PeopleIcon',
    name: 'Manage Users',
  }
]

export default routes
