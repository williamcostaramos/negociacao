import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{
		path: 'login',
		loadComponent: () =>
			import('./pages/login/login.page').then((module) => module.LoginPage),
	},
	{
		path: 'dashboard',
		loadComponent: () =>
			import('./pages/dashboard/dashboard.page').then((module) => module.DashboardPage),
	},
	{
		path: 'clientes',
		loadComponent: () =>
			import('./pages/clientes/clientes.page').then((module) => module.ClientesPage),
	},
	{
		path: 'usuarios',
		loadComponent: () =>
			import('./pages/usuarios/usuarios.page').then((module) => module.UsuariosPage),
	},
	{
		path: 'devedores',
		loadComponent: () =>
			import('./pages/devedores/devedores.page').then((module) => module.DevedoresPage),
	},
	{
		path: 'configuracoes',
		loadComponent: () =>
			import('./pages/configuracoes/configuracoes.page').then((module) => module.ConfiguracoesPage),
	},
	{ path: '**', redirectTo: 'login' },
];
