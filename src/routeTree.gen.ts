/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as ProtectedImport } from './routes/_protected'
import { Route as ProtectedDropzoneImport } from './routes/_protected/dropzone'

// Create Virtual Routes

const ProtectedIndexLazyImport = createFileRoute('/_protected/')()
const PublicRegisterLazyImport = createFileRoute('/_public/register')()
const PublicLogoutLazyImport = createFileRoute('/_public/logout')()
const PublicLoginLazyImport = createFileRoute('/_public/login')()
const ProtectedProjectIdLazyImport = createFileRoute('/_protected/$projectId')()

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const ProtectedRoute = ProtectedImport.update({
  id: '/_protected',
  getParentRoute: () => rootRoute,
} as any)

const ProtectedIndexLazyRoute = ProtectedIndexLazyImport.update({
  path: '/',
  getParentRoute: () => ProtectedRoute,
} as any).lazy(() =>
  import('./routes/_protected/index.lazy').then((d) => d.Route),
)

const PublicRegisterLazyRoute = PublicRegisterLazyImport.update({
  path: '/register',
  getParentRoute: () => PublicRoute,
} as any).lazy(() =>
  import('./routes/_public/register.lazy').then((d) => d.Route),
)

const PublicLogoutLazyRoute = PublicLogoutLazyImport.update({
  path: '/logout',
  getParentRoute: () => PublicRoute,
} as any).lazy(() =>
  import('./routes/_public/logout.lazy').then((d) => d.Route),
)

const PublicLoginLazyRoute = PublicLoginLazyImport.update({
  path: '/login',
  getParentRoute: () => PublicRoute,
} as any).lazy(() => import('./routes/_public/login.lazy').then((d) => d.Route))

const ProtectedProjectIdLazyRoute = ProtectedProjectIdLazyImport.update({
  path: '/$projectId',
  getParentRoute: () => ProtectedRoute,
} as any).lazy(() =>
  import('./routes/_protected/$projectId.lazy').then((d) => d.Route),
)

const ProtectedDropzoneRoute = ProtectedDropzoneImport.update({
  path: '/dropzone',
  getParentRoute: () => ProtectedRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_protected': {
      preLoaderRoute: typeof ProtectedImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/_protected/dropzone': {
      preLoaderRoute: typeof ProtectedDropzoneImport
      parentRoute: typeof ProtectedImport
    }
    '/_protected/$projectId': {
      preLoaderRoute: typeof ProtectedProjectIdLazyImport
      parentRoute: typeof ProtectedImport
    }
    '/_public/login': {
      preLoaderRoute: typeof PublicLoginLazyImport
      parentRoute: typeof PublicImport
    }
    '/_public/logout': {
      preLoaderRoute: typeof PublicLogoutLazyImport
      parentRoute: typeof PublicImport
    }
    '/_public/register': {
      preLoaderRoute: typeof PublicRegisterLazyImport
      parentRoute: typeof PublicImport
    }
    '/_protected/': {
      preLoaderRoute: typeof ProtectedIndexLazyImport
      parentRoute: typeof ProtectedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  ProtectedRoute.addChildren([
    ProtectedDropzoneRoute,
    ProtectedProjectIdLazyRoute,
    ProtectedIndexLazyRoute,
  ]),
  PublicRoute.addChildren([
    PublicLoginLazyRoute,
    PublicLogoutLazyRoute,
    PublicRegisterLazyRoute,
  ]),
])

/* prettier-ignore-end */
