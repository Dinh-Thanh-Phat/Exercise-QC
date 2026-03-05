import { test } from '@playwright/test';
import { loginDashboard } from '../helpers/auth.helper';
// import {
//   tryOpenCreateCardPopup,
//   navigateToCreateCard,
//   createCard,
//   verifyCardExists,
// } from '../helpers/card.helper';

const BASE_URL = {
  shop: 'https://app.incard.biz/convert-linkedin-profile/'
};

const USER = {
  email: 'thanhphat12tna234@gmail.com',
  password: '0985921776',
};

// const CARD_DATA = {
//   avatarPath: 'C:/Users/admin/Pictures/avatar.jpg',
//   firstName: 'Phat',
//   lastName: 'Dinh Thanh',
//   phone: '0123456789',
//   company: 'Inapps Technology',
// };

test ('Login Successfully', async({page}) => {
  await loginDashboard(
      page,
      BASE_URL.shop,
      USER.email,
      USER.password
  )
})

// test('Card Flow - Create card successfully', async ({ page }) => {
//   await test.step('Login from Shop', async () => {
//     await loginFromShop(
//       page,
//       BASE_URL.shop,
//       USER.email,
//       USER.password
//     );
//   });

//   const hasPopup = await test.step(
//     'Check create card popup',
//     async () => {
//       return await tryOpenCreateCardPopup(page);
//     }
//   );

//   if (!hasPopup) {
//     await test.step('Navigate manually to Create Card', async () => {
//       await navigateToCreateCard(page);
//     });
//   }

//   await test.step('Create new card', async () => {
//     await createCard(page, CARD_DATA);
//   });

//   await test.step('Verify card is created', async () => {
//     await verifyCardExists(page);
//   });
// });
