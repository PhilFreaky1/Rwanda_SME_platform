import { useMemo, useState, useEffect } from 'react'
import './App.css'

const metrics = [
  { value: 'RWF 86.4M', label: 'monthly revenue' },
  { value: '5,420', label: 'orders processed' },
  { value: '94%', label: 'inventory health' },
  { value: '2.8x', label: 'growth in 12 months' },
]

const features = [
  {
    title: 'Smart operations dashboard',
    text: 'Track sales, stock, KPIs, and finance in one live workspace designed for growing SMEs in Rwanda.',
  },
  {
    title: 'Finance clarity',
    text: 'Make faster cash-flow decisions with exports, receivables tracking, and budget visibility.',
  },
  {
    title: 'Inventory intelligence',
    text: 'Prevent shortages, prioritize restocks, and forecast demand with SKU-level monitoring.',
  },
  {
    title: 'Team coordination',
    text: 'Align sales, warehouse, and management teams around one source of truth for daily performance.',
  },
]

const impact = [
  'Reduce reporting delays by 40%',
  'Speed up decision-making across branches',
  'Improve supplier and stock collaboration',
]

const steps = [
  'Connect your sales, inventory, and finance data',
  'Automate daily operational reporting',
  'Scale with insight-driven growth decisions',
]

const testimonials = [
  {
    quote:
      'ProjectRwanda gave us a real operational command center. We can react to demand and cash flow in minutes instead of days.',
    author: 'Aline Mutesa',
    role: 'Operations Lead, Kigali Retail Group',
  },
  {
    quote:
      'The inventory and forecasting tools helped us reduce stock-outs during our busiest sales months.',
    author: 'Jean Bosco',
    role: 'Founder, Agaseke Market Hub',
  },
]

const initialProducts = [
  { id: 1, name: 'Rice 25kg', category: 'Groceries', quantity: 48, buyingPrice: 12000, sellingPrice: 16000, minimumStock: 20 },
  { id: 2, name: 'Cooking Oil', category: 'Groceries', quantity: 18, buyingPrice: 9000, sellingPrice: 13000, minimumStock: 15 },
  { id: 3, name: 'Soap', category: 'Household', quantity: 72, buyingPrice: 2200, sellingPrice: 3600, minimumStock: 30 },
  { id: 4, name: 'Flour', category: 'Bakery', quantity: 12, buyingPrice: 7000, sellingPrice: 9800, minimumStock: 15 },
]

const initialSales = [
  { id: 1, product: 'Rice 25kg', quantity: 12, amount: 192000, date: '2026-09-23' },
  { id: 2, product: 'Soap', quantity: 20, amount: 72000, date: '2026-09-24' },
  { id: 3, product: 'Cooking Oil', quantity: 9, amount: 117000, date: '2026-09-25' },
]

const initialExpenses = [
  { id: 1, title: 'Electricity bill', amount: 35000, category: 'Utilities', date: '2026-09-24' },
  { id: 2, title: 'Transport fuel', amount: 48000, category: 'Operations', date: '2026-09-25' },
]

const initialCustomers = [
  { id: 1, name: 'John', phone: '0781234567', purchases: 125000 },
  { id: 2, name: 'Eric', phone: '0729876543', purchases: 85000 },
  { id: 3, name: 'Alice', phone: '0791112233', purchases: 210000 },
]

const initialNotifications = [
  '⚠️ Rice stock is below minimum level.',
  '⚠️ 3 products are almost out of stock.',
  '✅ Daily sales target reached by 8%.',
]

const formatMoney = (amount) => `RWF ${Number(amount).toLocaleString()}`
const STORAGE_KEY = 'projectrwanda-sme-data'
const AUTH_KEY = 'projectrwanda-sme-auth'

const readStoredDashboardData = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY)
    return rawData ? JSON.parse(rawData) : null
  } catch {
    return null
  }
}

function App() {
  const storedDashboardData = useMemo(() => readStoredDashboardData(), [])
  const [view, setView] = useState('landing')
  const [activePage, setActivePage] = useState('overview')
  const [authMode, setAuthMode] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem(AUTH_KEY) === 'true')
  const [products, setProducts] = useState(() => storedDashboardData?.products ?? initialProducts)
  const [saleRecords, setSaleRecords] = useState(() => storedDashboardData?.saleRecords ?? initialSales)
  const [expenses, setExpenses] = useState(() => storedDashboardData?.expenses ?? initialExpenses)
  const [customers, setCustomers] = useState(() => storedDashboardData?.customers ?? initialCustomers)
  const [notifications] = useState(initialNotifications)
  const [search, setSearch] = useState('')
  const [editingProductId, setEditingProductId] = useState(null)

  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    quantity: '',
    buyingPrice: '',
    sellingPrice: '',
    minimumStock: '',
  })

  const [saleForm, setSaleForm] = useState({
    itemId: String(initialProducts[0].id),
    quantity: '',
    sellingPrice: initialProducts[0].sellingPrice,
  })

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    purchases: '',
  })

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term))
  }, [products, search])

  const salesTotal = saleRecords.reduce((sum, record) => sum + record.amount, 0)
  const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const profit = salesTotal - expensesTotal
  const inventoryValue = products.reduce((sum, product) => sum + product.quantity * product.buyingPrice, 0)
  const lowStockProducts = products.filter((product) => product.quantity <= product.minimumStock)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        products,
        saleRecords,
        expenses,
        customers,
      }),
    )
  }, [products, saleRecords, expenses, customers])

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isLoggedIn))
  }, [isLoggedIn])

  const goToDashboard = () => {
    setView('dashboard')
    setActivePage('overview')
    setIsLoggedIn(true)
  }

  const handleScrollTo = (sectionId) => {
    setView('landing')
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 20)
  }

  const handleAuthSubmit = (event) => {
    event.preventDefault()
    goToDashboard()
  }

  const handleProductSubmit = (event) => {
    event.preventDefault()

    if (!productForm.name || !productForm.category || !productForm.quantity || !productForm.buyingPrice || !productForm.sellingPrice) {
      return
    }

    const productData = {
      id: editingProductId ?? Date.now(),
      name: productForm.name,
      category: productForm.category,
      quantity: Number(productForm.quantity),
      buyingPrice: Number(productForm.buyingPrice),
      sellingPrice: Number(productForm.sellingPrice),
      minimumStock: Number(productForm.minimumStock || 15),
    }

    if (editingProductId) {
      setProducts((current) => current.map((product) => (product.id === editingProductId ? productData : product)))
    } else {
      setProducts((current) => [productData, ...current])
    }

    setProductForm({
      name: '',
      category: '',
      quantity: '',
      buyingPrice: '',
      sellingPrice: '',
      minimumStock: '',
    })
    setEditingProductId(null)
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product.id)
    setProductForm({
      name: product.name,
      category: product.category,
      quantity: String(product.quantity),
      buyingPrice: String(product.buyingPrice),
      sellingPrice: String(product.sellingPrice),
      minimumStock: String(product.minimumStock),
    })
  }

  const handleDeleteProduct = (productId) => {
    setProducts((current) => current.filter((product) => product.id !== productId))
    if (editingProductId === productId) {
      setEditingProductId(null)
      setProductForm({ name: '', category: '', quantity: '', buyingPrice: '', sellingPrice: '', minimumStock: '' })
    }
  }

  const handleSaleSubmit = (event) => {
    event.preventDefault()
    const product = products.find((item) => String(item.id) === saleForm.itemId)
    if (!product) return

    const quantitySold = Number(saleForm.quantity)
    const sellingPrice = Number(saleForm.sellingPrice) || product.sellingPrice

    if (!quantitySold || quantitySold <= 0) return
    if (quantitySold > product.quantity) {
      alert('Not enough stock available for this sale.')
      return
    }

    const saleAmount = quantitySold * sellingPrice

    setSaleRecords((current) => [
      {
        id: Date.now(),
        product: product.name,
        quantity: quantitySold,
        amount: saleAmount,
        date: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ])

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity - quantitySold }
          : item,
      ),
    )

    setSaleForm({
      itemId: String(product.id),
      quantity: '',
      sellingPrice: product.sellingPrice,
    })
  }

  const handleExpenseSubmit = (event) => {
    event.preventDefault()
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.category) return

    setExpenses((current) => [
      {
        id: Date.now(),
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        date: expenseForm.date || new Date().toISOString().slice(0, 10),
      },
      ...current,
    ])

    setExpenseForm({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().slice(0, 10),
    })
  }

  const handleCustomerSubmit = (event) => {
    event.preventDefault()
    if (!customerForm.name || !customerForm.phone) return

    setCustomers((current) => [
      {
        id: Date.now(),
        name: customerForm.name,
        phone: customerForm.phone,
        purchases: Number(customerForm.purchases || 0),
      },
      ...current,
    ])

    setCustomerForm({ name: '', phone: '', purchases: '' })
  }

  const exportCsvReport = (filename, rows) => {
    const csvContent = rows.map((row) => Object.values(row).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Sales', salesTotal],
      ['Expenses', expensesTotal],
      ['Profit', profit],
      ['Inventory value', inventoryValue],
      ['Products in stock', products.length],
    ]
    exportCsvReport('projectrwanda-report.csv', rows)
  }

  const handleDownloadPdf = () => {
    const pdfContents = [
      'ProjectRwanda SME Report',
      `Sales: ${formatMoney(salesTotal)}`,
      `Expenses: ${formatMoney(expensesTotal)}`,
      `Profit: ${formatMoney(profit)}`,
      `Inventory value: ${formatMoney(inventoryValue)}`,
      `Low stock alerts: ${lowStockProducts.length}`,
    ].join('\n')

    const blob = new Blob([pdfContents], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'projectrwanda-report.pdf'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      {view === 'landing' && (
        <div className="page-shell landing-page">
          <header className="topbar">
            <div className="brand-wrap" onClick={() => setView('landing')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && setView('landing')}>
              <div className="brand-mark">P</div>
              <div>
                <span className="brand-name">ProjectRwanda</span>
                <small>SME Platform</small>
              </div>
            </div>

            <nav className="main-nav" aria-label="Main navigation">
              <button type="button" className="nav-link" onClick={() => handleScrollTo('solutions')}>Solutions</button>
              <button type="button" className="nav-link" onClick={() => handleScrollTo('features')}>Features</button>
              <button type="button" className="nav-link" onClick={() => handleScrollTo('impact')}>Impact</button>
              <button type="button" className="nav-link" onClick={() => handleScrollTo('contact')}>Contact</button>
            </nav>

            {isLoggedIn ? (
              <button type="button" className="nav-cta" onClick={() => setView('dashboard')}>Back to dashboard</button>
            ) : (
              <button type="button" className="nav-cta" onClick={() => setView('register')}>Book demo</button>
            )}
          </header>

          <main>
            <section className="hero-section">
              <div className="hero-copy">
                <span className="eyebrow">Built for Rwanda’s next wave of business growth</span>
                <h1>Turn every SME operation into a smarter, faster-moving business.</h1>
                <p>
                  ProjectRwanda helps entrepreneurs and business teams manage sales, inventory,
                  finance, and execution from one streamlined platform built for local growth.
                </p>

                <div className="hero-actions">
                  <button type="button" className="primary-btn" onClick={() => (isLoggedIn ? setView('dashboard') : setView('register'))}>
                    {isLoggedIn ? 'Back to Dashboard' : 'Get Started'}
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => setView('login')}>See Platform</button>
                </div>

                <div className="trust-row">
                  <span>Trusted by SME leaders</span>
                  <div className="mini-badges">
                    <span>Kigali</span>
                    <span>Rubavu</span>
                    <span>Rwamagana</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual" aria-label="Operations dashboard preview">
                <div className="dashboard-card large-card">
                  <div className="card-top">
                    <span>Business overview</span>
                    <span className="status-pill success">+18.6%</span>
                  </div>

                  <div className="chart-bars" aria-hidden="true">
                    <span style={{ height: '38%' }} />
                    <span style={{ height: '52%' }} />
                    <span style={{ height: '44%' }} />
                    <span style={{ height: '70%' }} />
                    <span style={{ height: '60%' }} />
                    <span style={{ height: '82%' }} />
                    <span style={{ height: '90%' }} />
                  </div>

                  <div className="mini-kpis">
                    {metrics.slice(0, 3).map((item) => (
                      <div key={item.label}>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card floating-card">
                  <p>Cash flow</p>
                  <strong>RWF 19.6M</strong>
                  <small>Projected next 30 days</small>
                </div>
              </div>
            </section>

            <section className="stats-strip" aria-label="platform metrics">
              {metrics.map((item) => (
                <div key={item.label} className="stat-box">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </section>

            <section id="solutions" className="info-section">
              <div className="section-heading">
                <span className="eyebrow dark">Why businesses choose us</span>
                <h2>One platform for operations, sales, and growth.</h2>
              </div>

              <div id="features" className="feature-grid">
                {features.map((feature) => (
                  <article key={feature.title} className="feature-card">
                    <div className="feature-icon">✓</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="impact-section" id="impact">
              <div className="impact-copy">
                <span className="eyebrow dark">Built to perform</span>
                <h2>Keep your team aligned and your growth plan moving.</h2>
                <p>
                  Whether you are managing retail branches, a distribution business, or a services company,
                  ProjectRwanda gives your team the visibility and control needed to scale responsibly.
                </p>

                <ul className="impact-list">
                  {impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="steps-panel">
                <h3>How it works</h3>
                <ul>
                  {steps.map((step, index) => (
                    <li key={step}>
                      <span>{`0${index + 1}`}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="testimonial-section">
              <div className="section-heading narrow">
                <span className="eyebrow dark">Client feedback</span>
                <h2>Teams use ProjectRwanda to move faster with confidence.</h2>
              </div>

              <div className="testimonial-grid">
                {testimonials.map((item) => (
                  <article key={item.author} className="testimonial-card">
                    <p className="quote">“{item.quote}”</p>
                    <div className="author-block">
                      <strong>{item.author}</strong>
                      <span>{item.role}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <footer id="contact" className="footer-cta">
            <div>
              <span className="eyebrow">Ready to grow?</span>
              <h2>Launch your next phase of SME growth with ProjectRwanda.</h2>
            </div>
            <button type="button" className="primary-btn" onClick={() => setView('register')}>Request a Demo</button>
          </footer>
        </div>
      )}

      {(view === 'login' || view === 'register') && (
        <div className="auth-shell">
          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-wrap">
                <div className="brand-mark">P</div>
                <div>
                  <span className="brand-name">ProjectRwanda</span>
                  <small>Real SME Dashboard</small>
                </div>
              </div>
              <button type="button" className="ghost-btn" onClick={() => (isLoggedIn ? setView('dashboard') : setView('landing'))}>
                {isLoggedIn ? 'Back to Dashboard' : 'Back'}
              </button>
            </div>

            <div className="auth-toggle">
              <button
                type="button"
                className={authMode === 'login' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'register' && (
                <>
                  <label>
                    Full name
                    <input type="text" placeholder="Enter your full name" required />
                  </label>
                  <label>
                    Business name
                    <input type="text" placeholder="Your SME name" required />
                  </label>
                </>
              )}

              <label>
                Email address
                <input type="email" placeholder="owner@example.com" required />
              </label>

              <label>
                Password
                <input type="password" placeholder="••••••••" required />
              </label>

              <button type="submit" className="primary-btn wide-btn">
                {authMode === 'login' ? 'See Dashboard' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="dashboard-shell">
          <aside className="sidebar">
            <div className="brand-wrap">
              <div className="brand-mark">P</div>
              <div>
                <span className="brand-name">ProjectRwanda</span>
                <small>Owner hub</small>
              </div>
            </div>

            <nav className="sidebar-nav">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'inventory', label: 'Inventory' },
                { key: 'sales', label: 'Sales/POS' },
                { key: 'expenses', label: 'Expenses' },
                { key: 'customers', label: 'Customers' },
                { key: 'reports', label: 'Reports' },
                { key: 'notifications', label: 'Notifications' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={activePage === item.key ? 'side-link active' : 'side-link'}
                  onClick={() => setActivePage(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="dashboard-main">
            <header className="dashboard-topbar">
              <div>
                <p className="topbar-label">Welcome back</p>
                <h2>SME Operations Dashboard</h2>
              </div>
              <div className="topbar-actions">
                <button type="button" className="ghost-btn" onClick={() => {
                  setIsLoggedIn(false)
                  setView('landing')
                }}>Logout</button>
              </div>
            </header>

            {activePage === 'overview' && (
              <section className="content-section">
                <div className="summary-grid">
                  <div className="summary-card accent">
                    <span>Total sales</span>
                    <strong>{formatMoney(salesTotal)}</strong>
                  </div>
                  <div className="summary-card">
                    <span>Expenses</span>
                    <strong>{formatMoney(expensesTotal)}</strong>
                  </div>
                  <div className="summary-card">
                    <span>Profit</span>
                    <strong>{formatMoney(profit)}</strong>
                  </div>
                  <div className="summary-card">
                    <span>Inventory value</span>
                    <strong>{formatMoney(inventoryValue)}</strong>
                  </div>
                </div>

                <div className="panel-grid two-col">
                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Stock overview</h3>
                      <span className="chip warning">{lowStockProducts.length} alerts</span>
                    </div>
                    <ul className="simple-list">
                      {products.map((product) => (
                        <li key={product.id}>
                          <span>{product.name}</span>
                          <strong>{product.quantity} units</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Recent activity</h3>
                    </div>
                    <ul className="simple-list">
                      {notifications.map((item) => (
                        <li key={item}>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {activePage === 'inventory' && (
              <section className="content-section">
                <div className="panel-card inventory-panel">
                  <div className="panel-header split-header">
                    <h3>Inventory</h3>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search product"
                    />
                  </div>

                  <form onSubmit={handleProductSubmit} className="form-grid">
                    <input type="text" placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
                    <input type="text" placeholder="Category" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} />
                    <input type="number" placeholder="Quantity" value={productForm.quantity} onChange={(event) => setProductForm({ ...productForm, quantity: event.target.value })} />
                    <input type="number" placeholder="Buying price" value={productForm.buyingPrice} onChange={(event) => setProductForm({ ...productForm, buyingPrice: event.target.value })} />
                    <input type="number" placeholder="Selling price" value={productForm.sellingPrice} onChange={(event) => setProductForm({ ...productForm, sellingPrice: event.target.value })} />
                    <input type="number" placeholder="Low-stock alert" value={productForm.minimumStock} onChange={(event) => setProductForm({ ...productForm, minimumStock: event.target.value })} />
                    <button type="submit" className="primary-btn">
                      {editingProductId ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingProductId && (
                      <button type="button" className="ghost-btn" onClick={() => { setEditingProductId(null); setProductForm({ name: '', category: '', quantity: '', buyingPrice: '', sellingPrice: '', minimumStock: '' }) }}>
                        Cancel
                      </button>
                    )}
                  </form>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Buying price</th>
                        <th>Selling price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>{product.quantity}</td>
                          <td>{formatMoney(product.buyingPrice)}</td>
                          <td>{formatMoney(product.sellingPrice)}</td>
                          <td className="action-cell">
                            <button type="button" className="tiny-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                            <button type="button" className="tiny-btn danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activePage === 'sales' && (
              <section className="content-section">
                <div className="panel-grid two-col">
                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Sales / POS</h3>
                    </div>

                    <form onSubmit={handleSaleSubmit} className="form-grid compact-form">
                      <select value={saleForm.itemId} onChange={(event) => {
                        const selected = products.find((product) => String(product.id) === event.target.value)
                        setSaleForm({
                          ...saleForm,
                          itemId: event.target.value,
                          sellingPrice: selected ? selected.sellingPrice : '',
                        })
                      }}>
                        {products.map((product) => (
                          <option key={product.id} value={String(product.id)}>{product.name}</option>
                        ))}
                      </select>
                      <input type="number" placeholder="Quantity" value={saleForm.quantity} onChange={(event) => setSaleForm({ ...saleForm, quantity: event.target.value })} />
                      <input type="number" placeholder="Selling price" value={saleForm.sellingPrice} onChange={(event) => setSaleForm({ ...saleForm, sellingPrice: event.target.value })} />
                      <button type="submit" className="primary-btn">Record Sale</button>
                    </form>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Low-stock alerts</h3>
                    </div>
                    <ul className="alert-list">
                      {lowStockProducts.length > 0 ? (
                        lowStockProducts.map((product) => (
                          <li key={product.id}>
                            <strong>{product.name}</strong>
                            <span>Only {product.quantity} left</span>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span>No low-stock alerts right now.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="panel-card sales-log">
                  <div className="panel-header">
                    <h3>Recent sales</h3>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.product}</td>
                          <td>{record.quantity}</td>
                          <td>{formatMoney(record.amount)}</td>
                          <td>{record.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activePage === 'expenses' && (
              <section className="content-section">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Expenses</h3>
                  </div>

                  <form onSubmit={handleExpenseSubmit} className="form-grid">
                    <input type="text" placeholder="Expense title" value={expenseForm.title} onChange={(event) => setExpenseForm({ ...expenseForm, title: event.target.value })} />
                    <input type="number" placeholder="Amount" value={expenseForm.amount} onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })} />
                    <input type="text" placeholder="Category" value={expenseForm.category} onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })} />
                    <input type="date" value={expenseForm.date} onChange={(event) => setExpenseForm({ ...expenseForm, date: event.target.value })} />
                    <button type="submit" className="primary-btn">Add Expense</button>
                  </form>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>{expense.title}</td>
                          <td>{expense.category}</td>
                          <td>{formatMoney(expense.amount)}</td>
                          <td>{expense.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activePage === 'customers' && (
              <section className="content-section">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Customers</h3>
                  </div>

                  <form onSubmit={handleCustomerSubmit} className="form-grid">
                    <input type="text" placeholder="Name" value={customerForm.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} />
                    <input type="tel" placeholder="Phone" value={customerForm.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} />
                    <input type="number" placeholder="Purchases" value={customerForm.purchases} onChange={(event) => setCustomerForm({ ...customerForm, purchases: event.target.value })} />
                    <button type="submit" className="primary-btn">Add Customer</button>
                  </form>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Purchases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                          <td>{customer.name}</td>
                          <td>{customer.phone}</td>
                          <td>{formatMoney(customer.purchases)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activePage === 'reports' && (
              <section className="content-section">
                <div className="summary-grid reports-grid">
                  <div className="summary-card"><span>Daily sales</span><strong>{formatMoney(salesTotal)}</strong></div>
                  <div className="summary-card"><span>Weekly sales</span><strong>{formatMoney(salesTotal * 7)}</strong></div>
                  <div className="summary-card"><span>Monthly sales</span><strong>{formatMoney(salesTotal * 30)}</strong></div>
                  <div className="summary-card"><span>Expenses</span><strong>{formatMoney(expensesTotal)}</strong></div>
                  <div className="summary-card"><span>Profit</span><strong>{formatMoney(profit)}</strong></div>
                  <div className="summary-card"><span>Stock report</span><strong>{products.length} items</strong></div>
                </div>

                <div className="panel-card report-actions">
                  <button type="button" className="primary-btn" onClick={handleDownloadPdf}>Download PDF</button>
                  <button type="button" className="secondary-btn" onClick={handleExportExcel}>Export Excel</button>
                </div>
              </section>
            )}

            {activePage === 'notifications' && (
              <section className="content-section">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Notifications</h3>
                  </div>
                  <ul className="notification-list">
                    {notifications.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  )
}

export default App
