<script lang="ts">
import * as Card from "$lib/components/ui/card/index.js";
import * as Tooltip from "$lib/components/ui/tooltip/index.js";
import { Button } from "$lib/components/ui/button";
import { formatTimeAgo } from "$lib/utils";
import ErrorBrowserBreakdownTile from "$lib/components/graphs/tiles/error-browser-breakdown-tile.svelte";
import OsBreakdownTile from "$lib/components/graphs/tiles/os-breakdown-tile.svelte";
import CreateIssueDropdown from "$lib/components/create-issue-dropdown.svelte";
import ErrorPageBreakdown from "$lib/components/graphs/tiles/error-page-breakdown.svelte";
import Separator from "$lib/components/ui/separator/separator.svelte";
import AssignMemberSelect from "$lib/components/log-group-table/assign-member-select.svelte";

  export let group: any;
  export let pageBreakdown: any;
  export let browserBreakdown: any;
  export let osBreakdown: any;
</script>

<Card.Root class="w-full bg-muted/40 border-muted gap-4">
    <Card.Header>
      <h2 class="text-xl font-bold">Overview</h2>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-4 justify-between items-center">
        <Separator />
        <div class="w-full flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <h3 class="text-sm font-bold">Actions</h3>
            <CreateIssueDropdown />
            <AssignMemberSelect
              logGroupId={group.id}
              members={group.members}
              selectedMember={group.expand?.assignee}
            />
          </div>
          <Separator />
          <h3 class="text-sm font-bold">Event context</h3>
          <div class="w-full text-sm flex items-center justify-between">
            <p>First seen:</p>
            <Tooltip.Root openDelay={200}>
              <Tooltip.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost">
                  {formatTimeAgo(new Date(group.first_seen))}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{new Date(group.first_seen).toLocaleString()}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div class="w-full text-sm flex items-center justify-between">
            <p>Latest seen:</p>
            <Tooltip.Root openDelay={200}>
              <Tooltip.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost">
                  {formatTimeAgo(new Date(group.latest_seen))}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{new Date(group.latest_seen).toLocaleString()}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div class="w-full text-sm flex items-center justify-between">
            <p>Total count:</p>
            <p class="pr-4">{group.log_count}</p>
          </div>
          <Separator />
          <ErrorPageBreakdown data={pageBreakdown || []} />
          <Separator />
          <ErrorBrowserBreakdownTile data={browserBreakdown || []} />
          <Separator />
          <OsBreakdownTile data={osBreakdown || []} />
          <Separator />
        </div>
      </div>
    </Card.Content>
  </Card.Root>