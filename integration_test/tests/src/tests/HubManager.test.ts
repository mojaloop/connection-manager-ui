import * as dotenv from 'dotenv';
import { waitForReact } from 'testcafe-react-selectors';
import { config } from '../config';
import { LandingMenu } from '../page-objects/components/LandingMenu';
import { HubManagerPage } from '../page-objects/pages/HubManager'; // Remove DFSPRow type
const chance = require('chance');
import { Selector } from 'testcafe';

// Load environment variables
dotenv.config();

fixture `Hub Management Feature`
  .page`${config.connectionManagerEndpoint}`  // Ensure endpoint is properly configured
  .beforeEach(async (t) => {
    await waitForReact(); // Wait for React components to load
    await t
      .click(LandingMenu.hubButton) // Click on the hub button
      .wait(1000); // Wait for the UI to update after clicking
  });

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Able to add DFSP in DFSP Administration sub menu', async (t) => {
  // Navigate to Add DFSP feature
  await t.click(HubManagerPage.hubPageAdministrationDfspSubMenuButton).wait(1000);
  await t.click(HubManagerPage.hubPageAdministrationDfspSubMenuAddDfspButton).wait(1000);

  // Generate random DFSP name
  const randomDfspName = chance().company();
  await t.typeText(HubManagerPage.getAddDfspModalNameField, randomDfspName);
  
  // Select monetary zone
  await t.click(HubManagerPage.getAddDfspModalMonetaryZoneField)
        .wait(1000)
        .click(Selector('.input-select__options-item__label').withText('Euro'));
  
  // Submit DFSP form
  await t.click(HubManagerPage.getAddDfspModalSubmit).wait(1000);

  // Check if DFSP exists in the list
  const rows = await HubManagerPage.getDFSPRows();
  const dfspExists = await Promise.all(rows.map((r) => r.id.innerText));
  await t.expect(dfspExists).contains(randomDfspName); // Assert that DFSP is added
});
