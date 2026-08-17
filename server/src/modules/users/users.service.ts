import { prisma } from "../../lib/prisma.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import type { UpdateProfileInput } from "./validators/update-profile.validator.js";
import type { ChangePasswordInput } from "./validators/change-password.validator.js";
import type { ProfileView } from "./users.types.js";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  createdAt: true,
} as const;

type ProfileRecord = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
};

const toProfileView = (user: ProfileRecord): ProfileView => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
});

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput
): Promise<ProfileView> => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      ...(data.avatar !== undefined && { avatar: data.avatar }),
    },
    select: profileSelect,
  });

  return toProfileView(user);
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await comparePassword(
    data.currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};
