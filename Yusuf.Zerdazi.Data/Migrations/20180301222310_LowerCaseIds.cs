using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Yusuf.Zerdazi.Data.Migrations
{
    public partial class LowerCaseIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Everydays_Months_MonthID",
                table: "Everydays");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Everydays_EverydayID",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Pieces_SourceID",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Themes_ThemeID",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Themes_Months_MonthID",
                table: "Themes");

            migrationBuilder.RenameColumn(
                name: "MonthID",
                table: "Themes",
                newName: "MonthId");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Themes",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Themes_MonthID",
                table: "Themes",
                newName: "IX_Themes_MonthId");

            migrationBuilder.RenameColumn(
                name: "ThemeID",
                table: "Pieces",
                newName: "ThemeId");

            migrationBuilder.RenameColumn(
                name: "SourceID",
                table: "Pieces",
                newName: "SourceId");

            migrationBuilder.RenameColumn(
                name: "EverydayID",
                table: "Pieces",
                newName: "EverydayId");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Pieces",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_ThemeID",
                table: "Pieces",
                newName: "IX_Pieces_ThemeId");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_SourceID",
                table: "Pieces",
                newName: "IX_Pieces_SourceId");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_EverydayID",
                table: "Pieces",
                newName: "IX_Pieces_EverydayId");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Months",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "MonthID",
                table: "Everydays",
                newName: "MonthId");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Everydays",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Everydays_MonthID",
                table: "Everydays",
                newName: "IX_Everydays_MonthId");

            migrationBuilder.AddForeignKey(
                name: "FK_Everydays_Months_MonthId",
                table: "Everydays",
                column: "MonthId",
                principalTable: "Months",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pieces_Everydays_EverydayId",
                table: "Pieces",
                column: "EverydayId",
                principalTable: "Everydays",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pieces_Pieces_SourceId",
                table: "Pieces",
                column: "SourceId",
                principalTable: "Pieces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pieces_Themes_ThemeId",
                table: "Pieces",
                column: "ThemeId",
                principalTable: "Themes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Themes_Months_MonthId",
                table: "Themes",
                column: "MonthId",
                principalTable: "Months",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Everydays_Months_MonthId",
                table: "Everydays");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Everydays_EverydayId",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Pieces_SourceId",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Themes_ThemeId",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Themes_Months_MonthId",
                table: "Themes");

            migrationBuilder.RenameColumn(
                name: "MonthId",
                table: "Themes",
                newName: "MonthID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Themes",
                newName: "ID");

            migrationBuilder.RenameIndex(
                name: "IX_Themes_MonthId",
                table: "Themes",
                newName: "IX_Themes_MonthID");

            migrationBuilder.RenameColumn(
                name: "ThemeId",
                table: "Pieces",
                newName: "ThemeID");

            migrationBuilder.RenameColumn(
                name: "SourceId",
                table: "Pieces",
                newName: "SourceID");

            migrationBuilder.RenameColumn(
                name: "EverydayId",
                table: "Pieces",
                newName: "EverydayID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Pieces",
                newName: "ID");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_ThemeId",
                table: "Pieces",
                newName: "IX_Pieces_ThemeID");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_SourceId",
                table: "Pieces",
                newName: "IX_Pieces_SourceID");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_EverydayId",
                table: "Pieces",
                newName: "IX_Pieces_EverydayID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Months",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "MonthId",
                table: "Everydays",
                newName: "MonthID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Everydays",
                newName: "ID");

            migrationBuilder.RenameIndex(
                name: "IX_Everydays_MonthId",
                table: "Everydays",
                newName: "IX_Everydays_MonthID");

            migrationBuilder.AddForeignKey(
                name: "FK_Everydays_Months_MonthID",
                table: "Everydays",
                column: "MonthID",
                principalTable: "Months",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pieces_Everydays_EverydayID",
                table: "Pieces",
                column: "EverydayID",
                principalTable: "Everydays",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pieces_Pieces_SourceID",
                table: "Pieces",
                column: "SourceID",
                principalTable: "Pieces",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pieces_Themes_ThemeID",
                table: "Pieces",
                column: "ThemeID",
                principalTable: "Themes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Themes_Months_MonthID",
                table: "Themes",
                column: "MonthID",
                principalTable: "Months",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
