﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Migrations
{
    [DbContext(typeof(TaskManagerContext))]
    [Migration("20190711080940_revision1")]
    partial class revision1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TaskManagerAPI.Models.Project", b =>
                {
                    b.Property<int>("ProjectID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("EndDate");

                    b.Property<int>("ManagerID");

                    b.Property<int>("Priority");

                    b.Property<string>("ProjectName");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("ProjectID");

                    b.HasIndex("ManagerID");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("TaskManagerAPI.Models.Tasks", b =>
                {
                    b.Property<int>("TasksID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("EndDate");

                    b.Property<string>("Name");

                    b.Property<int>("ParentID");

                    b.Property<int>("Priority");

                    b.Property<int>("ProjectID");

                    b.Property<DateTime>("StartDate");

                    b.Property<string>("Status");

                    b.Property<int>("UserID");

                    b.HasKey("TasksID");

                    b.HasIndex("ProjectID");

                    b.HasIndex("UserID");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("TaskManagerAPI.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("EmployeeID");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.HasKey("UserID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TaskManagerAPI.Models.Project", b =>
                {
                    b.HasOne("TaskManagerAPI.Models.User", "Manager")
                        .WithMany("Projects")
                        .HasForeignKey("ManagerID")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("TaskManagerAPI.Models.Tasks", b =>
                {
                    b.HasOne("TaskManagerAPI.Models.Project", "Project")
                        .WithMany("Tasks")
                        .HasForeignKey("ProjectID")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("TaskManagerAPI.Models.User", "User")
                        .WithMany("Tasks")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}