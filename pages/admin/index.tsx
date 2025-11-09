import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import {
  convertFacebookPostToEmbed,
  isValidFacebookPostUrl,
} from '../../lib/facebook-utils';

interface SiteSettings {
  id?: number;
  title: string;
  subTitle: string;
  mainContent1: string;
  mainContent2: string;
  learnMoreText: string;
  contactMeContent: string;
  callMe: string;
  emailMe: string;
}

interface Quote {
  id?: number;
  text: string;
  isActive: string;
}

interface Link {
  id?: number;
  url: string;
  title?: string;
  description?: string;
  images?: string;
  isActive: string;
}

interface FacebookPost {
  id?: number;
  embedUrl: string;
  title?: string;
  description?: string;
  isActive: string;
}

interface ContactLink {
  id?: number;
  text: string;
  linkName: string;
  linkType: 'call' | 'email' | 'url';
  linkValue: string;
  linkImage?: string;
  isActive: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>({
    title: '',
    subTitle: '',
    mainContent1: '',
    mainContent2: '',
    learnMoreText: '',
    contactMeContent: '',
    callMe: '',
    emailMe: '',
  });

  // Quotes state
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState('');

  // Links state
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState({
    url: '',
    title: '',
    description: '',
    images: '',
  });
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Facebook Posts state
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [newFacebookPost, setNewFacebookPost] = useState({
    embedUrl: '',
    title: '',
    description: '',
  });
  const [facebookPostUrl, setFacebookPostUrl] = useState('');
  const [editingFacebookPost, setEditingFacebookPost] =
    useState<FacebookPost | null>(null);

  // Contact Links state
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [newContactLink, setNewContactLink] = useState({
    text: '',
    linkName: '',
    linkType: 'call' as 'call' | 'email' | 'url',
    linkValue: '',
    linkImage: '',
  });
  const [editingContactLink, setEditingContactLink] =
    useState<ContactLink | null>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const loadData = useCallback(async () => {
    try {
      // Load settings
      const settingsRes = await fetch('/api/admin/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData) {
          setSettings(settingsData);
        }
      }

      // Load quotes
      const quotesRes = await fetch('/api/admin/quotes');
      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        setQuotes(quotesData);
      }

      // Load links
      const linksRes = await fetch('/api/admin/links');
      if (linksRes.ok) {
        const linksData = await linksRes.json();
        setLinks(linksData);
      }

      // Load Facebook posts
      const facebookRes = await fetch('/api/admin/facebook-posts');
      if (facebookRes.ok) {
        const facebookData = await facebookRes.json();
        setFacebookPosts(facebookData);
      }

      // Load contact links
      const contactRes = await fetch('/api/admin/contact-links');
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setContactLinks(contactData);
      } else {
        const errorText = await contactRes.text();
        console.error(
          'Failed to load contact links:',
          contactRes.status,
          contactRes.statusText,
          'Response:',
          errorText,
        );
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Might be unauthorized, redirect to login
      router.push('/admin/login');
    }
  }, [router]);

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      // Check if user is authenticated by trying to access admin settings
      const response = await fetch('/api/admin/settings');
      if (response.status === 401) {
        // Not authenticated, redirect to login
        router.push('/admin/login');
        return;
      }
      
      // User is authenticated, proceed with loading data
      setIsAuthenticated(true);
      loadData();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  }, [router, loadData]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async () => {
    if (!newQuote.trim()) return;

    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newQuote, isActive: 'true' }),
      });

      if (response.ok) {
        setNewQuote('');
        loadData();
        setMessage('Quote added successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error adding quote');
    }
  };

  const deleteQuote = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/quotes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData();
        setMessage('Quote deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting quote');
    }
  };

  const addLink = async () => {
    if (!newLink.url.trim()) return;

    try {
      const linkData = {
        ...newLink,
        images: newLink.images
          ? newLink.images
              .split(',')
              .map((img) => img.trim())
              .filter((img) => img)
          : [],
        isActive: 'true',
      };

      const response = await fetch('/api/admin/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        setNewLink({ url: '', title: '', description: '', images: '' });
        loadData();
        setMessage('Link added successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error adding link');
    }
  };

  const editLink = (link: Link) => {
    setEditingLink({
      ...link,
      images: link.images ? JSON.parse(link.images).join(', ') : '',
    });
  };

  const updateLink = async () => {
    if (!editingLink || !editingLink.url.trim()) return;

    try {
      const linkData = {
        ...editingLink,
        images: editingLink.images
          ? editingLink.images
              .split(',')
              .map((img) => img.trim())
              .filter((img) => img)
          : [],
      };

      const response = await fetch(`/api/admin/links/${editingLink.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        setEditingLink(null);
        loadData();
        setMessage('Link updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating link');
    }
  };

  const cancelEdit = () => {
    setEditingLink(null);
  };

  const deleteLink = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData();
        setMessage('Link deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting link');
    }
  };

  // Facebook Posts functions
  const addFacebookPost = async () => {
    if (!newFacebookPost.embedUrl.trim()) return;

    try {
      const response = await fetch('/api/admin/facebook-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newFacebookPost, isActive: 'true' }),
      });

      if (response.ok) {
        setNewFacebookPost({ embedUrl: '', title: '', description: '' });
        loadData();
        setMessage('Facebook post added successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error adding Facebook post');
    }
  };

  const editFacebookPost = (post: FacebookPost) => {
    setEditingFacebookPost({ ...post });
  };

  const updateFacebookPost = async () => {
    if (!editingFacebookPost || !editingFacebookPost.embedUrl.trim()) return;

    try {
      const response = await fetch(
        `/api/admin/facebook-posts/${editingFacebookPost.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingFacebookPost),
        },
      );

      if (response.ok) {
        setEditingFacebookPost(null);
        loadData();
        setMessage('Facebook post updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating Facebook post');
    }
  };

  const cancelFacebookEdit = () => {
    setEditingFacebookPost(null);
  };

  const deleteFacebookPost = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/facebook-posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData();
        setMessage('Facebook post deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting Facebook post');
    }
  };

  const convertFacebookUrl = () => {
    if (!facebookPostUrl.trim()) {
      setMessage('Please enter a Facebook post URL');
      return;
    }

    try {
      const embedUrl = convertFacebookPostToEmbed(facebookPostUrl);
      setNewFacebookPost({ ...newFacebookPost, embedUrl });
      setFacebookPostUrl(''); // Clear the input
      setMessage('✅ Facebook URL converted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error converting URL: ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Contact Links functions
  const addContactLink = async () => {
    if (
      !newContactLink.text.trim() ||
      !newContactLink.linkName.trim() ||
      !newContactLink.linkValue.trim()
    )
      return;

    try {
      const response = await fetch('/api/admin/contact-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContactLink),
      });

      if (response.ok) {
        setNewContactLink({
          text: '',
          linkName: '',
          linkType: 'call',
          linkValue: '',
          linkImage: '',
        });
        loadData();
        setMessage('Contact link added successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error adding contact link');
    }
  };

  const editContactLink = (link: ContactLink) => {
    setEditingContactLink({ ...link });
  };

  const updateContactLink = async () => {
    if (
      !editingContactLink ||
      !editingContactLink.text.trim() ||
      !editingContactLink.linkName.trim() ||
      !editingContactLink.linkValue.trim()
    )
      return;

    try {
      const response = await fetch(
        `/api/admin/contact-links/${editingContactLink.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingContactLink),
        },
      );

      if (response.ok) {
        setEditingContactLink(null);
        loadData();
        setMessage('Contact link updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating contact link');
    }
  };

  const cancelContactEdit = () => {
    setEditingContactLink(null);
  };

  const deleteContactLink = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contact-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData();
        setMessage('Contact link deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting contact link');
    }
  };

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      <>
        <Head>
          <title>Admin Dashboard - North Country Cooling</title>
        </Head>
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - North Country Cooling</title>
      </Head>

      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-lg">
          <div className="navbar-start">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="navbar-end">
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className="alert alert-success mx-4 mt-4">
            <span>{message}</span>
          </div>
        )}

        <div className="container mx-auto p-4">
          <div className="tabs tabs-boxed mb-6">
            <a
              className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Site Settings
            </a>
            <a
              className={`tab ${activeTab === 'quotes' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('quotes')}
            >
              Quotes
            </a>
            <a
              className={`tab ${activeTab === 'links' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              Links
            </a>
            <a
              className={`tab ${activeTab === 'facebook' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('facebook')}
            >
              Facebook Posts
            </a>
            <a
              className={`tab ${activeTab === 'contact' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Links
            </a>
          </div>

          {activeTab === 'settings' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Site Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={settings.title}
                      onChange={(e) =>
                        setSettings({ ...settings, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Subtitle</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={settings.subTitle}
                      onChange={(e) =>
                        setSettings({ ...settings, subTitle: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={settings.callMe}
                      onChange={(e) =>
                        setSettings({ ...settings, callMe: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={settings.emailMe}
                      onChange={(e) =>
                        setSettings({ ...settings, emailMe: e.target.value })
                      }
                    />
                  </div>

                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Main Content 1</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={settings.mainContent1}
                    onChange={(e) =>
                      setSettings({ ...settings, mainContent1: e.target.value })
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Main Content 2</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={settings.mainContent2}
                    onChange={(e) =>
                      setSettings({ ...settings, mainContent2: e.target.value })
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learn More Text</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={settings.learnMoreText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        learnMoreText: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contact Me Content</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={settings.contactMeContent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contactMeContent: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    onClick={saveSettings}
                    disabled={loading}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Manage Quotes</h2>

                <div className="form-control mb-4">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Add new quote..."
                      className="input input-bordered flex-1"
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addQuote}>
                      Add Quote
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-3 bg-base-200 rounded"
                    >
                      <span className="flex-1">{quote.text}</span>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => quote.id && deleteQuote(quote.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Manage Links</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">URL *</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className="input input-bordered"
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title (optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Custom title for the link"
                      className="input input-bordered"
                      value={newLink.title}
                      onChange={(e) =>
                        setNewLink({ ...newLink, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description (optional)</span>
                    </label>
                    <textarea
                      placeholder="Custom description for the link"
                      className="textarea textarea-bordered h-20"
                      value={newLink.description}
                      onChange={(e) =>
                        setNewLink({ ...newLink, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Custom Images (optional)
                      </span>
                    </label>
                    <textarea
                      placeholder="Image URLs separated by commas (e.g., https://example.com/image1.jpg, https://example.com/image2.jpg)"
                      className="textarea textarea-bordered h-20"
                      value={newLink.images}
                      onChange={(e) =>
                        setNewLink({ ...newLink, images: e.target.value })
                      }
                    />
                    <label className="label">
                      <span className="label-text-alt">
                        If provided, these images will override the default link
                        preview images
                      </span>
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={addLink}>
                    Add Link
                  </button>
                </div>

                <div className="space-y-4">
                  {links.map((link) => (
                    <div key={link.id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        {editingLink && editingLink.id === link.id ? (
                          // Edit Form
                          <div className="space-y-4">
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">URL *</span>
                              </label>
                              <input
                                type="url"
                                className="input input-bordered"
                                value={editingLink.url}
                                onChange={(e) =>
                                  setEditingLink({
                                    ...editingLink,
                                    url: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Title (optional)
                                </span>
                              </label>
                              <input
                                type="text"
                                className="input input-bordered"
                                value={editingLink.title || ''}
                                onChange={(e) =>
                                  setEditingLink({
                                    ...editingLink,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Description (optional)
                                </span>
                              </label>
                              <textarea
                                className="textarea textarea-bordered h-20"
                                value={editingLink.description || ''}
                                onChange={(e) =>
                                  setEditingLink({
                                    ...editingLink,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Custom Images (optional)
                                </span>
                              </label>
                              <textarea
                                placeholder="Image URLs separated by commas"
                                className="textarea textarea-bordered h-20"
                                value={editingLink.images || ''}
                                onChange={(e) =>
                                  setEditingLink({
                                    ...editingLink,
                                    images: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="btn btn-primary"
                                onClick={updateLink}
                              >
                                Save Changes
                              </button>
                              <button
                                className="btn btn-ghost"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display View
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="link"
                                >
                                  {link.title || link.url}
                                </a>
                              </h3>
                              {link.description && (
                                <p className="text-sm opacity-70 mt-1">
                                  {link.description}
                                </p>
                              )}
                              <p className="text-xs opacity-50 mt-1">
                                {link.url}
                              </p>
                              {link.images && (
                                <div className="text-xs opacity-50 mt-1">
                                  Custom images:{' '}
                                  {JSON.parse(link.images).length} image(s)
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => editLink(link)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-error btn-sm"
                                onClick={() => link.id && deleteLink(link.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'facebook' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Manage Facebook Posts</h2>

                <div className="mb-6 card bg-accent/10 p-4">
                  <h3 className="text-lg font-semibold mb-3">
                    🔧 Facebook URL Converter
                  </h3>
                  <p className="text-sm opacity-80 mb-3">
                    Convert regular Facebook post URLs to embed format
                    automatically
                  </p>

                  <div className="form-control mb-3">
                    <label className="label">
                      <span className="label-text">Facebook Post URL</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="url"
                        placeholder="https://www.facebook.com/PageName/posts/postId"
                        className="input input-bordered flex-1"
                        value={facebookPostUrl}
                        onChange={(e) => setFacebookPostUrl(e.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={convertFacebookUrl}
                        disabled={
                          !facebookPostUrl.trim() ||
                          !isValidFacebookPostUrl(facebookPostUrl)
                        }
                      >
                        Convert to Embed
                      </button>
                    </div>
                    <label className="label">
                      <span className="label-text-alt">
                        Paste any Facebook post URL and click Convert to
                        generate the embed URL below
                      </span>
                    </label>
                  </div>

                  {facebookPostUrl && (
                    <div className="text-sm">
                      <span
                        className={`badge ${isValidFacebookPostUrl(facebookPostUrl) ? 'badge-success' : 'badge-error'}`}
                      >
                        {isValidFacebookPostUrl(facebookPostUrl)
                          ? '✅ Valid URL'
                          : '❌ Invalid URL format'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Facebook Embed URL *</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.facebook.com/plugins/post.php?href=..."
                      className="input input-bordered"
                      value={newFacebookPost.embedUrl}
                      onChange={(e) =>
                        setNewFacebookPost({
                          ...newFacebookPost,
                          embedUrl: e.target.value,
                        })
                      }
                    />
                    <label className="label">
                      <span className="label-text-alt">
                        Use the converter above or get embed URL from Facebook:
                        Share → Embed → Copy URL
                      </span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title (optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Custom title for admin reference"
                      className="input input-bordered"
                      value={newFacebookPost.title}
                      onChange={(e) =>
                        setNewFacebookPost({
                          ...newFacebookPost,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description (optional)</span>
                    </label>
                    <textarea
                      placeholder="Notes about this post for admin reference"
                      className="textarea textarea-bordered h-20"
                      value={newFacebookPost.description}
                      onChange={(e) =>
                        setNewFacebookPost({
                          ...newFacebookPost,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button className="btn btn-primary" onClick={addFacebookPost}>
                    Add Facebook Post
                  </button>
                </div>

                <div className="space-y-4">
                  {facebookPosts.map((post) => (
                    <div key={post.id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        {editingFacebookPost &&
                        editingFacebookPost.id === post.id ? (
                          // Edit Form
                          <div className="space-y-4">
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Facebook Embed URL *
                                </span>
                              </label>
                              <input
                                type="url"
                                className="input input-bordered"
                                value={editingFacebookPost.embedUrl}
                                onChange={(e) =>
                                  setEditingFacebookPost({
                                    ...editingFacebookPost,
                                    embedUrl: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Title (optional)
                                </span>
                              </label>
                              <input
                                type="text"
                                className="input input-bordered"
                                value={editingFacebookPost.title || ''}
                                onChange={(e) =>
                                  setEditingFacebookPost({
                                    ...editingFacebookPost,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Description (optional)
                                </span>
                              </label>
                              <textarea
                                className="textarea textarea-bordered h-20"
                                value={editingFacebookPost.description || ''}
                                onChange={(e) =>
                                  setEditingFacebookPost({
                                    ...editingFacebookPost,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="btn btn-primary"
                                onClick={updateFacebookPost}
                              >
                                Save Changes
                              </button>
                              <button
                                className="btn btn-ghost"
                                onClick={cancelFacebookEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display View
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold">
                                {post.title || 'Facebook Post'}
                              </h3>
                              {post.description && (
                                <p className="text-sm opacity-70 mt-1">
                                  {post.description}
                                </p>
                              )}
                              <p className="text-xs opacity-50 mt-1 truncate max-w-md">
                                {post.embedUrl}
                              </p>
                              <div className="mt-2">
                                <iframe
                                  src={post.embedUrl}
                                  width="300"
                                  height="200"
                                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                  className="border rounded"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => editFacebookPost(post)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  post.id && deleteFacebookPost(post.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Manage Contact Links</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Display Text *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Call them for a free estimate!"
                      className="input input-bordered"
                      value={newContactLink.text}
                      onChange={(e) =>
                        setNewContactLink({
                          ...newContactLink,
                          text: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Link Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Call Me"
                      className="input input-bordered"
                      value={newContactLink.linkName}
                      onChange={(e) =>
                        setNewContactLink({
                          ...newContactLink,
                          linkName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Link Type *</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={newContactLink.linkType}
                      onChange={(e) =>
                        setNewContactLink({
                          ...newContactLink,
                          linkType: e.target.value as 'call' | 'email' | 'url',
                        })
                      }
                    >
                      <option value="call">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="url">Website/URL</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {newContactLink.linkType === 'call'
                          ? 'Phone Number'
                          : newContactLink.linkType === 'email'
                            ? 'Email Address'
                            : 'URL'}{' '}
                        *
                      </span>
                    </label>
                    <input
                      type={
                        newContactLink.linkType === 'email'
                          ? 'email'
                          : newContactLink.linkType === 'url'
                            ? 'url'
                            : 'tel'
                      }
                      placeholder={
                        newContactLink.linkType === 'call'
                          ? '802-249-4858'
                          : newContactLink.linkType === 'email'
                            ? 'info@example.com'
                            : 'https://example.com'
                      }
                      className="input input-bordered"
                      value={newContactLink.linkValue}
                      onChange={(e) =>
                        setNewContactLink({
                          ...newContactLink,
                          linkValue: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Icon/Image (optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="📞 or image URL or icon class"
                      className="input input-bordered"
                      value={newContactLink.linkImage}
                      onChange={(e) =>
                        setNewContactLink({
                          ...newContactLink,
                          linkImage: e.target.value,
                        })
                      }
                    />
                    <label className="label">
                      <span className="label-text-alt">
                        Can be an emoji, image URL, or CSS icon class
                      </span>
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={addContactLink}>
                    Add Contact Link
                  </button>
                </div>

                <div className="space-y-4">
                  {contactLinks.length === 0 ? (
                    <div className="text-center p-8 text-base-content/50">
                      <p>No contact links found.</p>
                      <p className="text-sm">
                        Add your first contact link above to get started.
                      </p>
                    </div>
                  ) : (
                    contactLinks.map((link) => (
                      <div key={link.id} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          {editingContactLink &&
                          editingContactLink.id === link.id ? (
                            // Edit Form
                            <div className="space-y-4">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">
                                    Display Text *
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  className="input input-bordered"
                                  value={editingContactLink.text}
                                  onChange={(e) =>
                                    setEditingContactLink({
                                      ...editingContactLink,
                                      text: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">
                                    Link Name *
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  className="input input-bordered"
                                  value={editingContactLink.linkName}
                                  onChange={(e) =>
                                    setEditingContactLink({
                                      ...editingContactLink,
                                      linkName: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">
                                    Link Type *
                                  </span>
                                </label>
                                <select
                                  className="select select-bordered"
                                  value={editingContactLink.linkType}
                                  onChange={(e) =>
                                    setEditingContactLink({
                                      ...editingContactLink,
                                      linkType: e.target.value as
                                        | 'call'
                                        | 'email'
                                        | 'url',
                                    })
                                  }
                                >
                                  <option value="call">Phone Call</option>
                                  <option value="email">Email</option>
                                  <option value="url">Website/URL</option>
                                </select>
                              </div>

                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">
                                    {editingContactLink.linkType === 'call'
                                      ? 'Phone Number'
                                      : editingContactLink.linkType === 'email'
                                        ? 'Email Address'
                                        : 'URL'}{' '}
                                    *
                                  </span>
                                </label>
                                <input
                                  type={
                                    editingContactLink.linkType === 'email'
                                      ? 'email'
                                      : editingContactLink.linkType === 'url'
                                        ? 'url'
                                        : 'tel'
                                  }
                                  className="input input-bordered"
                                  value={editingContactLink.linkValue}
                                  onChange={(e) =>
                                    setEditingContactLink({
                                      ...editingContactLink,
                                      linkValue: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">
                                    Icon/Image (optional)
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  className="input input-bordered"
                                  value={editingContactLink.linkImage || ''}
                                  onChange={(e) =>
                                    setEditingContactLink({
                                      ...editingContactLink,
                                      linkImage: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="flex gap-2">
                                <button
                                  className="btn btn-primary"
                                  onClick={updateContactLink}
                                >
                                  Save Changes
                                </button>
                                <button
                                  className="btn btn-ghost"
                                  onClick={cancelContactEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display View
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {link.linkImage && (
                                    <span className="text-lg">
                                      {link.linkImage}
                                    </span>
                                  )}
                                  <h3 className="font-bold">{link.linkName}</h3>
                                  <span className="badge badge-neutral text-xs">
                                    {link.linkType.toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-sm opacity-70 mb-1">
                                  {link.text}
                                </p>
                                <p className="text-xs opacity-50">
                                  {link.linkType === 'call'
                                    ? `tel:${link.linkValue}`
                                    : link.linkType === 'email'
                                      ? `mailto:${link.linkValue}`
                                      : link.linkValue}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => editContactLink(link)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    link.id && deleteContactLink(link.id)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
