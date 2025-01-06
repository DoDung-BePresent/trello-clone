"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export const OrgControl = () => {
  const params = useParams<{ organizationId: string }>();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return; // setActive can be undefined.

    setActive({
      organization: params.organizationId,
    });
  }, [setActive, params.organizationId]);

  return null;
};
