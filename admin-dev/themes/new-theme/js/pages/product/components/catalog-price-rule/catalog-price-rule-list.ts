/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */
import {getCatalogRules} from '@pages/product/services/catalog-rule-service';
import {EventEmitter} from 'events';
import ProductMap from '@pages/product/product-map';

const CatalogPriceRuleMap = ProductMap.catalogPriceRule;

export default class CatalogPriceRuleList {
  eventEmitter: EventEmitter;

  listContainer: HTMLElement

  constructor(
  ) {
    this.listContainer = document.querySelector(CatalogPriceRuleMap.listContainer) as HTMLElement;
    this.eventEmitter = window.prestashop.instance.eventEmitter;
  }

  public renderList(): void {
    const {listFields} = CatalogPriceRuleMap;
    const tbody = this.listContainer.querySelector(`${CatalogPriceRuleMap.listContainer} tbody`) as HTMLElement;
    const trTemplateContainer = this.listContainer.querySelector(CatalogPriceRuleMap.listRowTemplate) as HTMLScriptElement;
    const trTemplate = trTemplateContainer.innerHTML as string;
    tbody.innerHTML = '';

    getCatalogRules().then((response) => {
      const catalogPriceRules = response.catalogPriceRules as Array<SpecificPriceForListing>;
      this.toggleListVisibility(catalogPriceRules.length > 0);

      catalogPriceRules.forEach((catalogPriceRule: CatalogPriceRuleForListing) => {
        const temporaryContainer = document.createElement('tbody');
        temporaryContainer.innerHTML = trTemplate.trim();

        const trClone = temporaryContainer.firstChild as HTMLElement;
        const idField = this.selectListField(trClone, listFields.catalogPriceRuleId);
        const currencyField = this.selectListField(trClone, listFields.currency);
        const countryField = this.selectListField(trClone, listFields.country);
        const groupField = this.selectListField(trClone, listFields.group);
        const shopField = this.selectListField(trClone, listFields.shop);
        const editBtn = this.selectListField(trClone, listFields.editBtn);
        idField.textContent = String(catalogPriceRule.id);
        currencyField.textContent = catalogPriceRule.currency;
        countryField.textContent = catalogPriceRule.country;
        groupField.textContent = catalogPriceRule.group;
        editBtn.dataset.specificPriceId = String(catalogPriceRule.id);
        tbody.append(trClone);
      });
    });
  }

  private toggleListVisibility(show: boolean): void {
    this.listContainer.classList.toggle('d-none', !show);
  }

  private selectListField(templateTrClone: HTMLElement, selector: string): HTMLElement {
    return templateTrClone.querySelector(selector) as HTMLElement;
  }
}
