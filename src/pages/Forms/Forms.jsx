import { useState } from 'react'
import { CalendarDays, Check, FileText, Mail, Search, UserRound } from 'lucide-react'
import { Button, Checkbox, DatePicker, FileUpload, Input, Radio, RangeSlider, Select, Switch, Textarea } from '../../common'
import './Forms.css'

const departmentOptions = [
  { label: 'Commercial', options: [{ label: 'Sales', value: 'sales' }, { label: 'Procurement', value: 'procurement' }] },
  { label: 'Operations', options: [{ label: 'Finance', value: 'finance' }, { label: 'Operations', value: 'operations' }] },
  { label: 'Restricted option', value: 'restricted', disabled: true },
]

export default function Forms() {
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [accepted, setAccepted] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [budget, setBudget] = useState(65)
  const [search, setSearch] = useState('')

  return (
    <div className="showcase-page forms-page">
      <header className="forms-page__header">
        <div><p className="eyebrow">Interaction library / 02</p><h1>Forms built for confident decisions</h1><p>Composed controls for collecting clear, complete information at speed.</p></div>
        <div className="page-header__meta"><span className="status-dot status-dot--blue" /> 10 control patterns</div>
      </header>

      <section className="showcase-card" aria-labelledby="input-controls">
        <div className="section-heading"><div><span className="section-kicker">01 / text entry</span><h2 id="input-controls">Basic inputs</h2></div><p>Strong defaults, helpful context, and clear feedback.</p></div>
        <div className="form-showcase__grid">
          <Input label="Full name" placeholder="Enter a name" leftIcon={<UserRound size={16} />} fullWidth />
          <Input label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} helperText="We'll only use this for account notifications." leftIcon={<Mail size={16} />} fullWidth />
          <Input label="Record reference" prefix="#" suffix="CRM" placeholder="0000" fullWidth />
          <Input label="Search records" type="search" value={search} onChange={(event) => setSearch(event.target.value)} clearable rightIcon={<Search size={16} />} fullWidth />
          <Input label="Password" type="password" defaultValue="secure-value" showPasswordToggle helperText="Use at least 12 characters." fullWidth />
          <Input label="Read-only value" value="Imported value" readOnly fullWidth />
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="select-controls">
        <div className="section-heading"><div><span className="section-kicker">02 / choices</span><h2 id="select-controls">Select and date controls</h2></div><p>Native controls that stay familiar and easy to scan.</p></div>
        <div className="form-showcase__grid">
          <Select label="Department" value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Choose a department" options={departmentOptions} helperText="Select the team responsible for this record." fullWidth />
          <DatePicker label="Review date" value={date} onChange={(event) => setDate(event.target.value)} min="2025-01-01" max="2030-12-31" required leftIcon={<CalendarDays size={16} />} fullWidth />
          <Select label="Validated selection" value="finance" onChange={() => undefined} options={departmentOptions} success successMessage="Ready to continue" fullWidth />
          <DatePicker label="Read-only date" value="2026-01-01" readOnly fullWidth />
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="choice-controls">
        <div className="section-heading"><div><span className="section-kicker">03 / selections</span><h2 id="choice-controls">Checkboxes, radios, and switches</h2></div><p>Group related choices with native semantics.</p></div>
        <div className="form-showcase__choice-grid">
          <div className="choice-panel"><h3>Checkbox group</h3><Checkbox label="Accept terms" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} required description="Required to continue." /><Checkbox label="Send a copy to my team" defaultChecked description="Keep collaborators informed." /><Checkbox label="Disabled choice" disabled /></div>
          <fieldset className="radio-group">
            <legend>Payment method</legend><Radio name="paymentMethod" value="card" label="Credit card" checked={paymentMethod === 'card'} onChange={(event) => setPaymentMethod(event.target.value)} /><Radio name="paymentMethod" value="invoice" label="Invoice" checked={paymentMethod === 'invoice'} onChange={(event) => setPaymentMethod(event.target.value)} /><Radio name="paymentMethod" value="cash" label="Cash (unavailable)" disabled checked={false} onChange={() => undefined} />
          </fieldset>
          <div className="choice-panel"><h3>Preferences</h3><Switch label="Email notifications" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} description="Receive updates about changes." /><Switch label="Weekly summary" defaultChecked /></div>
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="textarea-controls">
        <div className="section-heading"><div><span className="section-kicker">04 / long form</span><h2 id="textarea-controls">Notes and limits</h2></div><p>Make longer responses feel lightweight with visible boundaries.</p></div>
        <div className="form-showcase__grid">
          <Textarea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} characterLimit={240} showCounter helperText="Add enough context for the next person." fullWidth />
          <Textarea label="Compact notes" defaultValue="Imported from the previous review." rows={3} resize="none" readOnly success successMessage="Verified source" fullWidth />
        </div>
      </section>

      <section className="showcase-card" aria-labelledby="validation-controls"><div className="section-heading"><div><span className="section-kicker">05 / feedback</span><h2 id="validation-controls">Validation states</h2></div><p>Feedback is explicit and never relies on color alone.</p></div><div className="form-showcase__grid"><Input label="Needs attention" value="invalid@" onChange={() => undefined} error errorMessage="Enter a complete email address." fullWidth /><Input label="Looks good" value="approved@company.com" onChange={() => undefined} success successMessage="Email format is valid." fullWidth /><Select label="Review status" value="" onChange={() => undefined} placeholder="Choose a status" options={departmentOptions} warning warningMessage="A status is needed before submission." fullWidth /><Input label="Disabled value" value="Unavailable" disabled fullWidth /></div></section>

      <section className="showcase-card" aria-labelledby="advanced-controls"><div className="section-heading"><div><span className="section-kicker">06 / advanced inputs</span><h2 id="advanced-controls">Files and range</h2></div><p>Useful native controls for richer workflows.</p></div><div className="form-showcase__grid"><FileUpload label="Supporting documents" accept=".pdf,.doc,.docx" multiple description="PDF or Word documents, up to 10 MB each." /><RangeSlider label="Approval threshold" min={0} max={100} value={budget} onChange={(event) => setBudget(event.target.value)} helperText="Set the review threshold for this workflow." /></div></section>

      <section className="showcase-card showcase-card--form" aria-labelledby="sample-form"><div className="section-heading"><div><span className="section-kicker">07 / composition</span><h2 id="sample-form">Responsive sample form</h2></div><p>A realistic arrangement using the same reusable controls.</p></div><form className="sample-form" onSubmit={(event) => event.preventDefault()}><Input label="Request title" placeholder="e.g. Supplier onboarding" leftIcon={<FileText size={16} />} fullWidth /><Input label="Owner email" type="email" placeholder="name@company.com" required fullWidth /><div className="sample-form__actions"><Button variant="ghost" type="reset">Cancel</Button><Button type="submit" leftIcon={<Check size={16} />}>Save request</Button></div></form></section>
    </div>
  )
}