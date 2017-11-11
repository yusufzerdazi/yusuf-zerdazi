using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Yusuf.Zerdazi.Web.Migrations
{
    public partial class AddedPiecesSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Piece_Everydays_EverydayID",
                table: "Piece");

            migrationBuilder.DropForeignKey(
                name: "FK_Piece_Piece_SourceID",
                table: "Piece");

            migrationBuilder.DropForeignKey(
                name: "FK_Piece_Themes_ThemeID",
                table: "Piece");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Piece",
                table: "Piece");

            migrationBuilder.RenameTable(
                name: "Piece",
                newName: "Pieces");

            migrationBuilder.RenameIndex(
                name: "IX_Piece_ThemeID",
                table: "Pieces",
                newName: "IX_Pieces_ThemeID");

            migrationBuilder.RenameIndex(
                name: "IX_Piece_SourceID",
                table: "Pieces",
                newName: "IX_Pieces_SourceID");

            migrationBuilder.RenameIndex(
                name: "IX_Piece_EverydayID",
                table: "Pieces",
                newName: "IX_Pieces_EverydayID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Pieces",
                table: "Pieces",
                column: "ID");

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Everydays_EverydayID",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Pieces_SourceID",
                table: "Pieces");

            migrationBuilder.DropForeignKey(
                name: "FK_Pieces_Themes_ThemeID",
                table: "Pieces");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Pieces",
                table: "Pieces");

            migrationBuilder.RenameTable(
                name: "Pieces",
                newName: "Piece");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_ThemeID",
                table: "Piece",
                newName: "IX_Piece_ThemeID");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_SourceID",
                table: "Piece",
                newName: "IX_Piece_SourceID");

            migrationBuilder.RenameIndex(
                name: "IX_Pieces_EverydayID",
                table: "Piece",
                newName: "IX_Piece_EverydayID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Piece",
                table: "Piece",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Piece_Everydays_EverydayID",
                table: "Piece",
                column: "EverydayID",
                principalTable: "Everydays",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Piece_Piece_SourceID",
                table: "Piece",
                column: "SourceID",
                principalTable: "Piece",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Piece_Themes_ThemeID",
                table: "Piece",
                column: "ThemeID",
                principalTable: "Themes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
