<?php
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
use PrestaShop\PrestaShop\Adapter\Configuration;
use PrestaShopBundle\DependencyInjection\CacheAdapterFactory;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

class LegacyCompilerPass implements CompilerPassInterface
{
    /**
     * Add legacy services that need to be built using Context::getContext().
     *
     * @param ContainerBuilder $container
     */
    public function process(ContainerBuilder $container)
    {
        $context = Context::getContext();

        $definitions = [
            'configuration',
            'context',
            'db',
            'shop',
            'employee',
        ];

        $cacheFactory = new CacheAdapterFactory();
        $cacheDriver = $container->getParameter('cache.driver');
        $definitions[] = $cacheDriver;
        $container->set($cacheDriver, $cacheFactory->getCacheAdapter($cacheDriver));

        $this->buildSyntheticDefinitions($definitions, $container);

        $container->set('context', $context);
        $container->set('configuration', new Configuration());
        $container->set('db', Db::getInstance());
        $container->set('shop', $context->shop);
        $container->set('employee', $context->employee);
    }

    private function buildSyntheticDefinitions(array $keys, ContainerBuilder $container)
    {
        foreach ($keys as $key) {
            $definition = new Definition();
            $definition->setSynthetic(true);
            $container->setDefinition($key, $definition);
        }
    }
}
