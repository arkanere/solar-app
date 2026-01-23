<script lang="ts">
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import * as Card from "$lib/components/ui/card";
  import { formatDate, formatBusinessName } from "$lib/constants/projectFormatters";

  type Project = {
    id: string;
    title: string;
    pincode?: string;
    project_date?: string;
    business_slug?: string;
    cloudinary_public_id?: string;
    image_url?: string;
    project_slug: string;
  };

  let { projects = [] } = $props<{ projects: Project[] }>();
</script>

<Card.Root class="border-0 shadow-[theme(--shadow-lg)] mb-[theme(--spacing-2xl)]">
  <Card.Header class="text-center pb-[theme(--card-padding-y)]">
    <Card.Title class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">
      Recent Solar Installation Projects
    </Card.Title>
    <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
      <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
    </div>
    <Card.Description class="text-[theme(--font-size-base)] max-w-[theme(--max-width-2xl)] mx-auto">
      Explore real solar installations completed by our verified installers across India
    </Card.Description>
  </Card.Header>

  <Card.Content>
    {#if projects && projects.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] mb-[theme(--spacing-2xl)]">
        {#each projects as project (project.id)}
          <a
            href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
            rel="noopener"
            class="group"
          >
            <Card.Root class="overflow-hidden h-full card-interactive">
              <div class="aspect-square overflow-hidden">
                {#if project.cloudinary_public_id}
                  <img
                    src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${project.cloudinary_public_id}`}
                    alt="{project.title} - Solar installation project in {project.pincode || 'India'}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[theme(--duration-slow)]"
                    loading="lazy"
                  />
                {:else if project.image_url}
                  <img
                    src={project.image_url}
                    alt="{project.title} - Solar installation project in {project.pincode || 'India'}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[theme(--duration-slow)]"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center bg-muted">
                    <span class="text-muted-foreground">No Image</span>
                  </div>
                {/if}
              </div>

              <Card.Content class="pt-[theme(--spacing-lg)]">
                <h3 class="line-clamp-2 text-primary font-semibold text-[theme(--font-size-lg)] mb-[theme(--spacing-lg)]">
                  {project.title}
                </h3>
                <div class="text-muted-foreground flex flex-col gap-[theme(--spacing-sm)] text-[theme(--font-size-sm)]">
                  <p>Pincode: {project.pincode || "N/A"}</p>
                  <p>Completed on: {formatDate(project.project_date)}</p>
                  <p>
                    Installer: <span class="text-foreground font-medium">
                      {formatBusinessName(project.business_slug)}
                    </span>
                  </p>
                </div>
              </Card.Content>
            </Card.Root>
          </a>
        {/each}
      </div>

      <div class="text-center">
        <a href="/in/recent-solar-installation-projects" class="inline-block text-primary-foreground font-semibold bg-primary hover:bg-primary-hover hover:-translate-y-[theme(--hover-lift-sm)] px-[theme(--button-padding-x-default)] py-[theme(--button-padding-y-default)] rounded-[theme(--radius-lg)] transition-all duration-[theme(--transition-default)]">View All Projects →</a>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-muted-foreground">No recent projects available at the moment.</p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
