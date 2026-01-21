<script lang="ts">
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
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

<Card.Root class="border-0" style="box-shadow: var(--shadow-lg);">
  <Card.Header class="text-center" style="padding-bottom: var(--space-y-6);">
    <div class="flex justify-center" style="margin-bottom: var(--space-y-4);">
      <div style="height: 0.25rem; width: 5rem; background-color: hsl(var(--secondary)); border-radius: 9999px;"></div>
    </div>
    <Card.Title style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); font-weight: 700; margin-bottom: var(--space-y-2);">
      Recent Solar Installation Projects
    </Card.Title>
    <Card.Description style="font-size: var(--font-size-base); line-height: var(--font-size-base--line-height); max-width: var(--max-width-2xl); margin-left: auto; margin-right: auto;">
      Explore real solar installations completed by our verified installers across India
    </Card.Description>
  </Card.Header>

  <Card.Content>
    {#if projects && projects.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style="gap: var(--space-y-6); margin-bottom: 2rem;">
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
                    class="w-full h-full object-cover group-hover:scale-105"
                    style="transition: transform var(--transition-slow);"
                    loading="lazy"
                  />
                {:else if project.image_url}
                  <img
                    src={project.image_url}
                    alt="{project.title} - Solar installation project in {project.pincode || 'India'}"
                    class="w-full h-full object-cover group-hover:scale-105"
                    style="transition: transform var(--transition-slow);"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center bg-muted">
                    <span class="text-muted-foreground">No Image</span>
                  </div>
                {/if}
              </div>

              <Card.Content style="padding-top: var(--space-y-4);">
                <h3 class="line-clamp-2 text-primary" style="font-weight: 600; font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height); margin-bottom: var(--space-y-2);">
                  {project.title}
                </h3>
                <div class="text-muted-foreground" style="gap: 0.25rem; display: flex; flex-direction: column; font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height);">
                  <p>Pincode: {project.pincode || "N/A"}</p>
                  <p>Completed on: {formatDate(project.project_date)}</p>
                  <p>
                    Installer: <span class="text-foreground" style="font-weight: 500;">
                      {formatBusinessName(project.business_slug)}
                    </span>
                  </p>
                </div>
              </Card.Content>
            </Card.Root>
          </a>
        {/each}
      </div>

      <div class="flex justify-center border-t" style="padding-top: var(--space-y-4);">
        <Button variant="default" asChild>
          <a href="/in/recent-solar-installation-projects">
            View All Projects →
          </a>
        </Button>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-muted-foreground">No recent projects available at the moment.</p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
