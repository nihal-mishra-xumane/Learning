import { useState } from 'react'
import { ClipboardList, FileText, LayoutDashboard, Users } from 'lucide-react'
import Tabs from '../../common/Tabs'
import './Tabs.css'

const crmTabs = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'contacts', label: 'Contacts', count: 12, icon: <Users /> },
  { id: 'deals', label: 'Deals', count: 8 },
  { id: 'activities', label: 'Activities' },
]

const procurementTabs = [
  { id: 'details', label: 'Details' },
  { id: 'items', label: 'Items', count: 5, icon: <ClipboardList /> },
  { id: 'supplier', label: 'Supplier' },
  { id: 'approval', label: 'Approval', disabled: true },
  { id: 'history', label: 'History', icon: <FileText /> },
]

const activityTabs = [
  { id: 'all', label: 'All activity', count: 28 },
  { id: 'comments', label: 'Comments', count: 9 },
  { id: 'mentions', label: 'Mentions', count: 3 },
  { id: 'files', label: 'Files', count: 16 },
  { id: 'archived', label: 'Archived', disabled: true },
]

const compactTabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'notes', label: 'Notes' },
]

const stayTabs = [
  { id: 'hotels', label: 'Hotels' },
  { id: 'apartments', label: 'Apartments' },
  { id: 'guesthouses', label: 'Guesthouses' },
]

const workspaceTabs = [
  { id: 'all', label: 'All work' },
  { id: 'mine', label: 'Assigned to me' },
  { id: 'recent', label: 'Recently viewed' },
]

const tabContent = {
  overview: 'A concise overview of the selected record appears here.',
  contacts: 'Related contacts and their recent activity appear here.',
  deals: 'A summary of related opportunities appears here.',
  activities: 'Recent activity for this record appears here.',
  details: 'The core details for this item appear here.',
  items: 'Line items and quantities for this item appear here.',
  supplier: 'Supplier information and contacts appear here.',
  approval: 'Approval information appears here when enabled.',
  history: 'A chronological history appears here.',
}

export default function TabsPage() {
  const [mode, setMode] = useState('crm')
  const [activeTab, setActiveTab] = useState('overview')
  const [activeActivityTab, setActiveActivityTab] = useState('all')
  const [activeCompactTab, setActiveCompactTab] = useState('summary')
  const [activeStayTab, setActiveStayTab] = useState('hotels')
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('all')
  const tabs = mode === 'crm' ? crmTabs : procurementTabs

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setActiveTab(nextMode === 'crm' ? 'overview' : 'details')
  }

  return (
    <div className="tabs-page demo-page demo-page--tabs">
      <div className="page-heading">
        <p className="eyebrow">Common / Tabs</p>
        <h1>Tabs</h1>
        <p>One controlled component shared by different screens through configuration.</p>
      </div>

      <section className="component-section" aria-labelledby="tabs-examples-heading">
        <div className="section-heading">
          <h2 id="tabs-examples-heading">Configuration examples</h2>
          <p>Switch examples to see the same component handle icons, counts, disabled tabs, and different labels.</p>
        </div>
        <div className="demo-actions">
          <button type="button" className={mode === 'crm' ? 'demo-button--active' : ''} onClick={() => switchMode('crm')}>
            Customer details
          </button>
          <button type="button" className={mode === 'procurement' ? 'demo-button--active' : ''} onClick={() => switchMode('procurement')}>
            Purchase order
          </button>
        </div>
        <div className="tabs-demo">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="tabs-demo__content" role="tabpanel" aria-live="polite">
            <strong>{tabs.find((tab) => tab.id === activeTab)?.label ?? 'No tab selected'}</strong>
            <p>{tabContent[activeTab]}</p>
          </div>
        </div>
      </section>

      <section className="component-section" aria-labelledby="pills-heading">
        <div className="section-heading">
          <h2 id="pills-heading">Pills variant</h2>
          <p>The optional variant changes presentation without changing the controlled API.</p>
        </div>
        <div className="tabs-demo tabs-demo--pills">
          <Tabs tabs={compactTabs} activeTab={activeCompactTab} onChange={setActiveCompactTab} variant="pills" />
          <div className="tabs-demo__content tabs-demo__content--compact" role="tabpanel" aria-live="polite">
            <strong>{compactTabs.find((tab) => tab.id === activeCompactTab)?.label}</strong>
            <p>A compact pills treatment works well for a small set of peer views.</p>
          </div>
        </div>
      </section>

      <section className="component-section" aria-labelledby="filled-heading">
        <div className="section-heading">
          <h2 id="filled-heading">Filled pill tabs</h2>
          <p>A flexible pill group for switching between peer categories such as accommodation types.</p>
        </div>
        <div className="tabs-demo tabs-demo--filled">
          <Tabs tabs={stayTabs} activeTab={activeStayTab} onChange={setActiveStayTab} variant="pills" />
          <div className="tabs-demo__content tabs-demo__content--compact" role="tabpanel" aria-live="polite">
            <strong>{stayTabs.find((tab) => tab.id === activeStayTab)?.label}</strong>
            <p>Browse available {stayTabs.find((tab) => tab.id === activeStayTab)?.label.toLowerCase()} in this example view.</p>
          </div>
        </div>
      </section>

      <section className="component-section" aria-labelledby="segmented-heading">
        <div className="section-heading">
          <h2 id="segmented-heading">Soft segmented tabs</h2>
          <p>A quieter treatment for compact filters and workspace views.</p>
        </div>
        <div className="tabs-demo tabs-demo--segmented">
          <Tabs tabs={workspaceTabs} activeTab={activeWorkspaceTab} onChange={setActiveWorkspaceTab} variant="pills" />
          <div className="tabs-demo__content tabs-demo__content--compact" role="tabpanel" aria-live="polite">
            <strong>{workspaceTabs.find((tab) => tab.id === activeWorkspaceTab)?.label}</strong>
            <p>Content for the selected workspace view is owned by the consuming page.</p>
          </div>
        </div>
      </section>

      <section className="component-section" aria-labelledby="counts-heading">
        <div className="section-heading">
          <h2 id="counts-heading">Counts and disabled state</h2>
          <p>Counts are optional configuration, and disabled tabs remain visible without accepting interaction.</p>
        </div>
        <div className="tabs-demo">
          <Tabs tabs={activityTabs} activeTab={activeActivityTab} onChange={setActiveActivityTab} />
          <div className="tabs-demo__content" role="tabpanel" aria-live="polite">
            <strong>{activityTabs.find((tab) => tab.id === activeActivityTab)?.label}</strong>
            <p>Activity content can be owned and rendered by the consuming page.</p>
          </div>
        </div>
      </section>

      <section className="component-section" aria-labelledby="responsive-heading">
        <div className="section-heading">
          <h2 id="responsive-heading">Responsive overflow</h2>
          <p>Long labels stay readable and the tab list scrolls horizontally on smaller screens.</p>
        </div>
        <div className="tabs-demo">
          <Tabs
            tabs={[
              { id: 'recent', label: 'Recently viewed' },
              { id: 'assigned', label: 'Assigned to my team' },
              { id: 'shared', label: 'Shared with me' },
              { id: 'saved', label: 'Saved for later' },
              { id: 'completed', label: 'Completed items' },
            ]}
            activeTab="recent"
          />
        </div>
      </section>

      <section className="component-section" aria-labelledby="tabs-usage-heading">
        <div className="section-heading">
          <h2 id="tabs-usage-heading">Usage</h2>
          <p><code>tabs</code> provides ids, labels, optional icons, counts, and disabled state. <code>activeTab</code> and <code>onChange</code> remain owned by the page. Use <code>variant=&quot;pills&quot;</code> when a contained treatment is preferred.</p>
        </div>
      </section>
    </div>
  )
}
