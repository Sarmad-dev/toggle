import { ControllerRenderProps } from "react-hook-form";
import * as React from "react";
import { MultiSelect } from "../ui/multi-select";
import { MultiSelectOption } from "@/types/global";
import { useUsers } from "@/hooks/use-users";

type Props = {
  field: ControllerRenderProps<
    {
      name: string;
      description: string;
      logo: File;
      membersId?: string[] | undefined;
    },
    "membersId"
  >;
};

const OnboardingMembersSelect = ({ field }: Props) => {
  const { users } = useUsers()

  const options = users?.map((user) => ({
    label: user.name || user.username, // username
    value: user.id, // id
    email: user.email, // optional email for searching;
    imageUrl: user.image,
  })) as MultiSelectOption[];

  return (
    <MultiSelect
      options={options}
      selected={field.value ?? []}
      className="w-full"
      placeholder="Select Members"
      onChange={field.onChange}
      width="w-[450px]"
    />
  );
};

export default OnboardingMembersSelect;
