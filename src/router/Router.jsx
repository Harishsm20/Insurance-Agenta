import React from 'react'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
  import DashLayout from '../layouts/DashLayout';

  import {ADashboard, AAddDestination,ADestinations, ACategory, APackages, AAddPackage, AAddCategory, ARequestList} from '../pages';
import Company from '../pages/Company';


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>  
        <Route path="/" element={<DashLayout />}>
          <Route index element={<ADashboard />} />
          <Route path="company" element={<Company />} />
          <Route path="addCompany" element={<AAddDestination />} />
          <Route path="records" element={<ACategory />} />
          <Route path="addRecords" element={<AAddCategory />} />
        </Route>
      </>
    ),
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
        v7_startTransition: true,
      },
    }
  );
export default router