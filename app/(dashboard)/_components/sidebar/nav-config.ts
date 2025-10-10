import type { Role } from '@/db/schema/user';

import { Box, Cog, Home, Settings, Users, Wrench } from 'lucide-react';

export type NavItem = {
  path: string;
  label: string;
  icon: typeof Home;
  allowedRoles?: Role[]; // undefined = todos podem acessar
  disabled?: boolean;
  title: string; // Para o header
};

/**
 * Configuração centralizada de navegação e proteção de rotas
 *
 * Esta configuração é usada para:
 * - Renderizar a sidebar com permissões corretas
 * - Proteger rotas contra acesso não autorizado
 * - Definir títulos das páginas no header
 *
 * Para adicionar uma nova rota:
 * 1. Adicione o item aqui
 * 2. A sidebar e proteção serão atualizadas automaticamente
 */
export const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: Home,
    title: 'Dashboard'
  },
  {
    path: '/suas-maquinas',
    label: 'Suas Máquinas',
    icon: Users,
    allowedRoles: ['cliente', 'admin'],
    disabled: false,
    title: 'Suas Máquinas'
  },
  {
    path: '/maquinas',
    label: 'Máquinas',
    icon: Box,
    allowedRoles: ['engenheiro', 'admin'],
    title: 'Máquinas'
  },
  {
    path: '/adicionar-maquina',
    label: 'Adicionar Máquina',
    icon: Cog,
    allowedRoles: ['engenheiro', 'admin'],
    title: 'Adicionar Máquina'
  },
  {
    path: '/adicionar-peca',
    label: 'Adicionar Peça',
    icon: Wrench,
    allowedRoles: ['engenheiro', 'admin'],
    title: 'Adicionar Peça'
  },
  {
    path: '/configuracoes',
    label: 'Configurações',
    icon: Settings,
    allowedRoles: ['cliente', 'admin'],
    disabled: true,
    title: 'Configurações'
  }
];

/**
 * Retorna o título da página baseado no pathname
 */
export function getPageTitle(pathname: string): string {
  const item = navItems.find((item) => {
    if (item.path === '/') {
      return pathname === item.path;
    }
    return pathname.startsWith(item.path);
  });

  return item?.title || 'Dashboard';
}
