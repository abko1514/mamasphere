// lib/services/dataQualityManager.ts
import {
  JobRecommendation,
  CareerTip,
  FreelanceOpportunity,
  SmallBusiness,
} from "@/models/Career";

class DataQualityManager {
  public validateJob(job: JobRecommendation): boolean {
    return !!(
      job.title &&
      job.company &&
      job.description &&
      job.matchScore >= 0 &&
      job.matchScore <= 100
    );
  }

  public validateTip(tip: CareerTip): boolean {
    return !!(
      tip.title &&
      tip.content &&
      tip.content.length > 50 &&
      tip.category &&
      tip.relevanceScore !== undefined
    );
  }

  public validateFreelanceOp(opportunity: FreelanceOpportunity): boolean {
    return !!(
      opportunity.title &&
      opportunity.clientName &&
      opportunity.budget &&
      opportunity.skillsRequired &&
      opportunity.skillsRequired.length > 0
    );
  }

  public validateBusiness(business: SmallBusiness): boolean {
    return !!(
      business.businessName &&
      business.ownerName &&
      business.category &&
      business.contactInfo?.email
    );
  }

  public cleanAndValidateJobs(jobs: JobRecommendation[]): JobRecommendation[] {
    return jobs
      .filter((job) => this.validateJob(job))
      .map((job) => ({
        ...job,
        description: this.sanitizeText(job.description),
        title: this.sanitizeText(job.title),
        company: this.sanitizeText(job.company),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  public cleanAndValidateTips(tips: CareerTip[]): CareerTip[] {
    return tips
      .filter((tip) => this.validateTip(tip))
      .map((tip) => ({
        ...tip,
        title: this.sanitizeText(tip.title),
        content: this.sanitizeText(tip.content),
      }))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .substring(0, 2000); // Limit length
  }
}

export const dataQualityManager = new DataQualityManager();
