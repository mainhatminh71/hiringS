import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

export interface SEOData {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    noindex?: boolean;
    structuredData?: any;
}

@Injectable({
    providedIn: 'root'
})
export class SEOService {
    private title = inject(Title);
    private meta = inject(Meta);
    private router = inject(Router);
    private baseUrl = 'https://hiring-s-rho.vercel.app';

    constructor() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.updateCanonicalUrl();
            })
    }
    updateSEO(data: SEOData): void {
        const url = data.url || `${this.baseUrl}${this.router.url}`;
        const type = data.type || 'website';
        
        if (data.title) {
            this.title.setTitle(data.title);
            this.meta.updateTag({ property: 'og:title', content: data.title });
            this.meta.updateTag({ name: 'twitter:title', content: data.title });
        }
        if (data.description) {
            this.meta.updateTag({ name: 'description', content: data.description });
            this.meta.updateTag({ property: 'og:description', content: data.description });
            this.meta.updateTag({ name: 'twitter:description', content: data.description });
        }
        if (data.keywords) {
            this.meta.updateTag({ name: 'keywords', content: data.keywords });
        }
        
        const image = data.image || `${this.baseUrl}/assets/og-default.jpg`;
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ name: 'twitter:image', content: image });

        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:type', content: type });
        this.meta.updateTag({ property: 'og:site_name', content: 'HiringS' });
        this.meta.updateTag({ name: 'twitter:url', content: url });

        if (data.noindex) {
            this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
        } else {
            this.meta.updateTag({ name: 'robots', content: 'index, follow' });
        }

        // Update structured data
        if (data.structuredData) {
            if (Array.isArray(data.structuredData)) {
                // If array, combine into @graph
                this.updateStructuredData({
                    "@context": "https://schema.org",
                    "@graph": data.structuredData
                });
            } else {
                this.updateStructuredData(data.structuredData);
            }
        }
    }
    private updateCanonicalUrl() : void {
        const url = `${this.baseUrl}${this.router.url}`;
        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }
    private updateStructuredData(data: any) : void {
        let script : HTMLScriptElement | null = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }
    generateJobPostingSchema(job: any): any {
        return {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": job.title,
          "description": `Apply for ${job.title} position at HiringS`,
          "identifier": {
            "@type": "PropertyValue",
            "name": "HiringS",
            "value": job.formId
          },
          "datePosted": job.postedDate,
          "employmentType": job.type,
          "hiringOrganization": {
            "@type": "Organization",
            "name": "HiringS",
            "sameAs": this.baseUrl
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location || "Not specified"
            }
          }
        };
      }
      generateOrganizationSchema(): any {
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "HiringS",
          "url": this.baseUrl,
          "logo": `${this.baseUrl}/favicon.svg`,
          "description": "Mission-driven company empowering every person and organization to achieve more"
        };
      }
      generateBreadcrumbSchema(items: Array<{name: string, url: string}>): any {
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
      }

}