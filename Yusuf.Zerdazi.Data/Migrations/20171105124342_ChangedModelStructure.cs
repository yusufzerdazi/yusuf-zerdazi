using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Yusuf.Zerdazi.Data.Migrations
{
    public partial class ChangedModelStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Months_Themes_AudioID",
                table: "Months");

            migrationBuilder.DropForeignKey(
                name: "FK_Months_Themes_ImageID",
                table: "Months");

            migrationBuilder.DropIndex(
                name: "IX_Months_AudioID",
                table: "Months");

            migrationBuilder.DropIndex(
                name: "IX_Months_ImageID",
                table: "Months");

            migrationBuilder.DropColumn(
                name: "AudioID",
                table: "Months");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "Months");

            migrationBuilder.DropColumn(
                name: "OriginalAudio",
                table: "Everydays");

            migrationBuilder.DropColumn(
                name: "OriginalImage",
                table: "Everydays");

            migrationBuilder.DropColumn(
                name: "SourceAudio",
                table: "Everydays");

            migrationBuilder.DropColumn(
                name: "SourceImageTitle",
                table: "Everydays");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Everydays");

            migrationBuilder.AddColumn<int>(
                name: "Medium",
                table: "Themes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MonthID",
                table: "Themes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Piece",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EverydayID = table.Column<int>(type: "int", nullable: true),
                    SourceID = table.Column<int>(type: "int", nullable: true),
                    ThemeID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    URL = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Piece", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Piece_Everydays_EverydayID",
                        column: x => x.EverydayID,
                        principalTable: "Everydays",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Piece_Piece_SourceID",
                        column: x => x.SourceID,
                        principalTable: "Piece",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Piece_Themes_ThemeID",
                        column: x => x.ThemeID,
                        principalTable: "Themes",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Themes_MonthID",
                table: "Themes",
                column: "MonthID");

            migrationBuilder.CreateIndex(
                name: "IX_Piece_EverydayID",
                table: "Piece",
                column: "EverydayID");

            migrationBuilder.CreateIndex(
                name: "IX_Piece_SourceID",
                table: "Piece",
                column: "SourceID");

            migrationBuilder.CreateIndex(
                name: "IX_Piece_ThemeID",
                table: "Piece",
                column: "ThemeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Themes_Months_MonthID",
                table: "Themes",
                column: "MonthID",
                principalTable: "Months",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Themes_Months_MonthID",
                table: "Themes");

            migrationBuilder.DropTable(
                name: "Piece");

            migrationBuilder.DropIndex(
                name: "IX_Themes_MonthID",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "Medium",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "MonthID",
                table: "Themes");

            migrationBuilder.AddColumn<int>(
                name: "AudioID",
                table: "Months",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "Months",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "OriginalAudio",
                table: "Everydays",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "OriginalImage",
                table: "Everydays",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SourceAudio",
                table: "Everydays",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceImageTitle",
                table: "Everydays",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Everydays",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Months_AudioID",
                table: "Months",
                column: "AudioID");

            migrationBuilder.CreateIndex(
                name: "IX_Months_ImageID",
                table: "Months",
                column: "ImageID");

            migrationBuilder.AddForeignKey(
                name: "FK_Months_Themes_AudioID",
                table: "Months",
                column: "AudioID",
                principalTable: "Themes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Months_Themes_ImageID",
                table: "Months",
                column: "ImageID",
                principalTable: "Themes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
