import { Schema, Document, model, Types } from 'mongoose';

interface ProgramDocument extends Document {
  title: string;
  programCode: string;
  qualificationLevel: string;
  department: string;
  college: string;
  institution: string;
  lastReviewDate: string;
  programSpecification: string;
  programsMainLocation: string;
  majorTracks: string[];
  exitPoints: string[];
  totalCreditHours: string;
  programMission: string;
  programGoals: string;
  programLearningOutcomes: {
    knowledgeAndUnderstanding: string[];
    skills: string[];
    valuesAutonomyResponsibility: string[];
  };
  courses: Types.ObjectId[];
  levels: Types.ObjectId[];
}

const ProgramSchema = new Schema<ProgramDocument>({
  title: { type: String, required: true },
  programCode: { type: String, required: true },
  qualificationLevel: { type: String, required: true },
  department: { type: String, required: true },
  college: { type: String, required: true },
  institution: { type: String, required: true },
  lastReviewDate: { type: String, required: true },
  programSpecification: { type: String, required: true },
  programsMainLocation: { type: String, required: true },
  majorTracks: { type: [String], required: true },
  exitPoints: { type: [String], required: true },
  totalCreditHours: { type: String, required: true },
  programMission: { type: String, required: true },
  programGoals: { type: String, required: true },
  programLearningOutcomes: {
    knowledgeAndUnderstanding: { type: [String], required: true },
    skills: { type: [String], required: true },
    valuesAutonomyResponsibility: { type: [String], required: true }
  },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course', required: true }],
  levels: [{ type: Schema.Types.ObjectId, ref: 'Level', required: true }]
});

export default model<ProgramDocument>('Program', ProgramSchema);
