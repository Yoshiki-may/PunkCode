import { KPISummary } from './KPISummary';
import { PipelineBoard } from './PipelineBoard';
import { TodaysTasks } from './TodaysTasks';
import { FollowUpAlerts } from './FollowUpAlerts';
import { CommunicationChannels } from './CommunicationChannels';
import { SalesProcessFlow } from './SalesProcessFlow';

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Today's Tasks */}
      <TodaysTasks />

      {/* Sales Process Flow */}
      <SalesProcessFlow />

      {/* Pipeline Board and Right Sidebar */}
      <div className="grid grid-cols-3 gap-8">
        {/* Pipeline Board - 2/3 width */}
        <div className="col-span-2">
          <PipelineBoard />
        </div>

        {/* Right Sidebar - 1/3 width */}
        <div className="space-y-8">
          <KPISummary />
          <FollowUpAlerts />
        </div>
      </div>

      {/* Communication Channels */}
      <CommunicationChannels />
    </div>
  );
}