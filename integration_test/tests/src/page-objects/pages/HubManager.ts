import { Selector } from "testcafe";

export type DFSPRow = {
  row: Selector,
  id: Selector,
  name: Selector,
  securityGroup: Selector,
}

export const HubManagerPage = {
  hubPageAdministrationDfspSubMenuButton: Selector('.el-menu__item').withText('DFSPs'),
  hubPageAdministrationDfspSubMenuAddDfspButton: Selector('.input-button__label').withText('Add DFSP'),

  getAddDfspModal: () => Selector('.el-modal__header-title')
    .withText(`Add DFSP`)
    .parent().parent('.el-modal__container'),
  getAddDfspModalNameField: Selector('.dfsp-modal__dfsp-name input'),
  getAddDfspModalIdField: Selector('.dfsp-modal__dfsp-id input'),
  getAddDfspModalEmailField: Selector('.dfsp-modal__dfsp-email input'),
  getAddDfspModalMonetaryZoneField: Selector('.dfsp-modal__dfsp-monetary-zone input'),
  getAddDfspModalSubmit: Selector('.el-modal__submit'),

  async getDFSPRows(): Promise<DFSPRow[]> {
    const rows = Selector('.hub__dfsps__list .el-datalist__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        id: rows.nth(i).find('.hub__dfsps__id').nth(0),
        name: rows.nth(i).find('.hub__dfsps__name').nth(1),
        securityGroup: rows.nth(i).find('.hub__dfsps__security-group').nth(2),
        // Monetary Zone doesn't seem to have a usable class name
        // TODO: Add class name
      }));
  },
};
