IF OBJECT_ID(N'__EFMigrationsHistory') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name])
);

GO

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [AccessFailedCount] int NOT NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [Email] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [LockoutEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [PasswordHash] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [UserName] nvarchar(256) NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

GO

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

GO

CREATE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]);

GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

GO

CREATE INDEX [IX_AspNetUserRoles_UserId] ON [AspNetUserRoles] ([UserId]);

GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]);

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'00000000000000_CreateIdentitySchema', N'2.0.0-rtm-26452');

GO

CREATE TABLE [Themes] (
    [ID] int NOT NULL IDENTITY,
    [Title] nvarchar(max) NULL,
    CONSTRAINT [PK_Themes] PRIMARY KEY ([ID])
);

GO

CREATE TABLE [Months] (
    [ID] int NOT NULL IDENTITY,
    [AudioID] int NULL,
    [ImageID] int NULL,
    [Start] datetime2 NOT NULL,
    CONSTRAINT [PK_Months] PRIMARY KEY ([ID]),
    CONSTRAINT [FK_Months_Themes_AudioID] FOREIGN KEY ([AudioID]) REFERENCES [Themes] ([ID]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Months_Themes_ImageID] FOREIGN KEY ([ImageID]) REFERENCES [Themes] ([ID]) ON DELETE NO ACTION
);

GO

CREATE TABLE [Everydays] (
    [ID] int NOT NULL IDENTITY,
    [Date] datetime2 NOT NULL,
    [MonthID] int NULL,
    [OriginalAudio] bit NOT NULL,
    [OriginalImage] bit NOT NULL,
    [SourceAudio] nvarchar(max) NULL,
    [SourceImageTitle] nvarchar(max) NULL,
    [Title] nvarchar(max) NULL,
    CONSTRAINT [PK_Everydays] PRIMARY KEY ([ID]),
    CONSTRAINT [FK_Everydays_Months_MonthID] FOREIGN KEY ([MonthID]) REFERENCES [Months] ([ID]) ON DELETE NO ACTION
);

GO

CREATE INDEX [IX_Everydays_MonthID] ON [Everydays] ([MonthID]);

GO

CREATE INDEX [IX_Months_AudioID] ON [Months] ([AudioID]);

GO

CREATE INDEX [IX_Months_ImageID] ON [Months] ([ImageID]);

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20171104230558_InitialCreate', N'2.0.0-rtm-26452');

GO

ALTER TABLE [Months] DROP CONSTRAINT [FK_Months_Themes_AudioID];

GO

ALTER TABLE [Months] DROP CONSTRAINT [FK_Months_Themes_ImageID];

GO

DROP INDEX [IX_Months_AudioID] ON [Months];

GO

DROP INDEX [IX_Months_ImageID] ON [Months];

GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Months') AND [c].[name] = N'AudioID');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Months] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Months] DROP COLUMN [AudioID];

GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Months') AND [c].[name] = N'ImageID');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Months] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Months] DROP COLUMN [ImageID];

GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Everydays') AND [c].[name] = N'OriginalAudio');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Everydays] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Everydays] DROP COLUMN [OriginalAudio];

GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Everydays') AND [c].[name] = N'OriginalImage');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Everydays] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [Everydays] DROP COLUMN [OriginalImage];

GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Everydays') AND [c].[name] = N'SourceAudio');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Everydays] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Everydays] DROP COLUMN [SourceAudio];

GO

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Everydays') AND [c].[name] = N'SourceImageTitle');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Everydays] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [Everydays] DROP COLUMN [SourceImageTitle];

GO

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Everydays') AND [c].[name] = N'Title');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Everydays] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [Everydays] DROP COLUMN [Title];

GO

ALTER TABLE [Themes] ADD [Medium] int NOT NULL DEFAULT 0;

GO

ALTER TABLE [Themes] ADD [MonthID] int NULL;

GO

CREATE TABLE [Piece] (
    [ID] int NOT NULL IDENTITY,
    [EverydayID] int NULL,
    [SourceID] int NULL,
    [ThemeID] int NULL,
    [Title] nvarchar(max) NULL,
    [URL] nvarchar(max) NULL,
    CONSTRAINT [PK_Piece] PRIMARY KEY ([ID]),
    CONSTRAINT [FK_Piece_Everydays_EverydayID] FOREIGN KEY ([EverydayID]) REFERENCES [Everydays] ([ID]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Piece_Piece_SourceID] FOREIGN KEY ([SourceID]) REFERENCES [Piece] ([ID]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Piece_Themes_ThemeID] FOREIGN KEY ([ThemeID]) REFERENCES [Themes] ([ID]) ON DELETE NO ACTION
);

GO

CREATE INDEX [IX_Themes_MonthID] ON [Themes] ([MonthID]);

GO

CREATE INDEX [IX_Piece_EverydayID] ON [Piece] ([EverydayID]);

GO

CREATE INDEX [IX_Piece_SourceID] ON [Piece] ([SourceID]);

GO

CREATE INDEX [IX_Piece_ThemeID] ON [Piece] ([ThemeID]);

GO

ALTER TABLE [Themes] ADD CONSTRAINT [FK_Themes_Months_MonthID] FOREIGN KEY ([MonthID]) REFERENCES [Months] ([ID]) ON DELETE NO ACTION;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20171105124342_ChangedModelStructure', N'2.0.0-rtm-26452');

GO

ALTER TABLE [Piece] DROP CONSTRAINT [FK_Piece_Everydays_EverydayID];

GO

ALTER TABLE [Piece] DROP CONSTRAINT [FK_Piece_Piece_SourceID];

GO

ALTER TABLE [Piece] DROP CONSTRAINT [FK_Piece_Themes_ThemeID];

GO

ALTER TABLE [Piece] DROP CONSTRAINT [PK_Piece];

GO

EXEC sp_rename N'Piece', N'Pieces';

GO

EXEC sp_rename N'Pieces.IX_Piece_ThemeID', N'IX_Pieces_ThemeID', N'INDEX';

GO

EXEC sp_rename N'Pieces.IX_Piece_SourceID', N'IX_Pieces_SourceID', N'INDEX';

GO

EXEC sp_rename N'Pieces.IX_Piece_EverydayID', N'IX_Pieces_EverydayID', N'INDEX';

GO

ALTER TABLE [Pieces] ADD CONSTRAINT [PK_Pieces] PRIMARY KEY ([ID]);

GO

ALTER TABLE [Pieces] ADD CONSTRAINT [FK_Pieces_Everydays_EverydayID] FOREIGN KEY ([EverydayID]) REFERENCES [Everydays] ([ID]) ON DELETE NO ACTION;

GO

ALTER TABLE [Pieces] ADD CONSTRAINT [FK_Pieces_Pieces_SourceID] FOREIGN KEY ([SourceID]) REFERENCES [Pieces] ([ID]) ON DELETE NO ACTION;

GO

ALTER TABLE [Pieces] ADD CONSTRAINT [FK_Pieces_Themes_ThemeID] FOREIGN KEY ([ThemeID]) REFERENCES [Themes] ([ID]) ON DELETE NO ACTION;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20171105124623_AddedPiecesSet', N'2.0.0-rtm-26452');

GO

