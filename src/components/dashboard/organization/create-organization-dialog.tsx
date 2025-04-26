import OnboardingForm from "@/components/onboarding/onboarding-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus } from "lucide-react";

import React, { useState } from "react";

const CreateOrganizationDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm">
              You don&apos;t have an organization, to create a project, first you
              have to{" "}
              <span
                className="text-primary underline cursor-pointer"
                role="button"
                onClick={() => setOpen((prev) => !prev)}
              >
                create an organization
              </span>
            </p>
          </HoverCardContent>
        </HoverCard>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an Organization</DialogTitle>
          <DialogDescription>
            Create an Organization, invite members, create team and start
            working on real projects.
          </DialogDescription>
        </DialogHeader>

        <OnboardingForm formType="COMPACT" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
