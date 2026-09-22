import { ArrowDownToLine, ArrowRight, Check, CirclePlus, Edit3, Filter, MoreHorizontal, Save, Search, Settings, Trash2 } from 'lucide-react'
import { Button } from '../../common'

export default function Buttons() {
  return (
    <div className="showcase-page buttons-page">
      <header className="buttons-page__header">
        <div><p className="eyebrow">Interaction library / 01</p><h1>Buttons that move work forward</h1><p>Clear action language, consistent states, and enough flexibility for every workflow.</p></div>
        <div className="page-header__meta"><span className="status-dot" /> 10 variants · 5 sizes</div>
      </header>

      <section className="showcase-card" aria-labelledby="button-variants">
        <div className="section-heading"><div><span className="section-kicker">01 / foundations</span><h2 id="button-variants">Button variants</h2></div><p>Use emphasis to guide the next best action.</p></div>
        <div className="button-showcase__row">
          <Button>Primary action</Button><Button variant="secondary">Secondary</Button><Button variant="success" leftIcon={<Check size={16} />}>Success</Button><Button variant="danger" leftIcon={<Trash2 size={16} />}>Danger</Button><Button variant="warning">Warning</Button><Button variant="info">Info</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="text">Text</Button><Button variant="link">Link action</Button>
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="button-sizes">
        <div className="section-heading"><div><span className="section-kicker">02 / scale</span><h2 id="button-sizes">Sizes and shape</h2></div><p>Touch-friendly defaults with compact options for dense tables.</p></div>
        <div className="button-showcase__row button-showcase__row--aligned">
          <Button size="xs">Extra small</Button><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button><Button size="xl" rounded>Rounded XL</Button>
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="button-icons">
        <div className="section-heading"><div><span className="section-kicker">03 / affordances</span><h2 id="button-icons">Icons and states</h2></div><p>Icons reinforce intent; labels keep actions understandable.</p></div>
        <div className="button-showcase__row">
          <Button leftIcon={<Save size={16} />}>Save changes</Button><Button rightIcon={<ArrowRight size={16} />} variant="secondary">Continue</Button><Button square variant="ghost" aria-label="More actions" title="More actions"><MoreHorizontal size={18} /></Button><Button leftIcon={<ArrowDownToLine size={16} />} badge="3">Download</Button><Button disabled>Disabled</Button><Button loading loadingText="Saving...">Save</Button>
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="button-actions">
        <div className="section-heading"><div><span className="section-kicker">04 / patterns</span><h2 id="button-actions">Action patterns</h2></div><p>Common combinations ready for CRM and procurement screens.</p></div>
        <div className="action-demo">
          <div className="action-demo__toolbar"><div><strong>Supplier review</strong><span>Updated a few moments ago</span></div><div className="button-showcase__row"><Button size="sm" variant="ghost" leftIcon={<Filter size={15} />}>Filter</Button><Button size="sm" variant="outline" leftIcon={<Settings size={15} />}>Settings</Button><Button size="sm" leftIcon={<CirclePlus size={15} />}>Add record</Button></div></div>
          <div className="button-group" role="group" aria-label="Record actions"><Button variant="secondary" leftIcon={<Edit3 size={15} />}>Edit</Button><Button variant="secondary" leftIcon={<Search size={15} />}>View details</Button><Button variant="danger" leftIcon={<Trash2 size={15} />}>Delete</Button></div>
        </div>
      </section>

      <section className="showcase-card showcase-card--dark" aria-labelledby="button-form">
        <div className="section-heading"><div><span className="section-kicker">05 / layout</span><h2 id="button-form">Full-width and form behavior</h2></div><p>Buttons adapt to the container without losing hierarchy.</p></div>
        <div className="button-showcase__stack">
          <Button fullWidth rounded leftIcon={<Check size={16} />} onClick={() => undefined}>Continue to review</Button>
          <div className="button-showcase__row"><Button type="submit">Submit</Button><Button type="reset" variant="secondary">Reset</Button>
          </div>
        </div>
      </section>
    </div>
  )
}