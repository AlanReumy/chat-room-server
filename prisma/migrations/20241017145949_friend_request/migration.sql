/*
  Warnings:

  - You are about to drop the `FriendshipRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `FriendshipRequest`;

-- CreateTable
CREATE TABLE `FriendRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromUserId` INTEGER NOT NULL,
    `toUserId` INTEGER NOT NULL,
    `reason` VARCHAR(100) NOT NULL,
    `status` INTEGER NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
