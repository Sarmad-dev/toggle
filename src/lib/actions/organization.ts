"use server";

import { uploadFile } from "../storage";
import { createClient } from "../supabase/server";

interface CreateOrganizationParams {
  name: string;
  description: string;
  membersId?: string[];
  logo: File;
  projectInvitationCode?: string;
}

export const createOrganization = async (data: CreateOrganizationParams) => {
  try {
    const supabase = await createClient();
    const userSession = await supabase.auth.getUser();

    const user = await prisma?.user.findUnique({
      where: {
        email: userSession.data.user?.email,
      },
    });

    const fileData = await uploadFile(
      data.logo,
      "org-logo",
      "organizations-logo"
    );

    const organization = await prisma?.organization.create({
      data: {
        name: data.name,
        description: data.description,
        logo: fileData?.url,
        ownerId: user?.id as string,
      },
    });

    if (organization && data.membersId) {
      data.membersId.map(async (memberId) => {
        const invitation = await prisma?.organizationInvitation.create({
          data: {
            organizationId: organization.id,
            invitedUserId: memberId,
            invitedById: user?.id as string,
          },
        });

        await prisma?.notification.create({
          data: {
            userId: memberId,
            type: "ORGANIZATION_INVITATION",
            title: "Organization Invitation",
            message: `You have been invited by ${
              user?.name || user?.username
            } to his ${
              organization.name
            } organization. Please accept or declined.`,
            data: invitation?.id,
          },
        });
      });
      console.log("Sending Organization invitation to members");
    }

    // TODO: Join any project by invitation code
    if (data.projectInvitationCode) {
      console.log("Project Invitation Code");
    }

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    throw new Error(error as unknown as string);
  }
};

export const getOrganizationByUserId = async (userId: string) => {
  try {
    const organization = await prisma?.organization.findFirst({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
        projects: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!organization) {
      return {
        success: false,
        message: "No organization found",
      };
    }

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
};

export const getOrganizationMember = async (organizationId: string) => {
  try {
    const members = await prisma?.organizationMembers.findMany({
      where: {
        organizationId,
      },
      include: {
        user: true,
      },
    });

    if (!members) {
      return {
        success: false,
        message: "No members found",
      };
    }

    return {
      success: true,
      data: members,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
};
